import { ExecutionContext, Injectable, CanActivate, UnauthorizedException, Inject, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpService as NestHttpService } from '@nestjs/axios';

import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class IntraAuthGuards extends AuthGuard('42') {
	async canActivate(context: ExecutionContext) {
		const activate = (await super.canActivate(context)) as boolean;
		const request = context.switchToHttp().getRequest();
		await super.logIn(request);
		return activate;
	}
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		return req.isAuthenticated();
	}
}

@Injectable()
export class IsAuthGuard implements CanActivate {
	constructor(private readonly httpService: NestHttpService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			
			await firstValueFrom(
				this.httpService.get('https://api.intra.42.fr/oauth/token/info', {
						headers: { 
							Authorization: `Bearer ${token}`,
						},
					}).pipe(
						catchError((error: AxiosError) => {
							throw new UnauthorizedException();
						}),
					),
				);
			return (true);
		} catch {
			throw new UnauthorizedException();
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers['authorization']?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}

