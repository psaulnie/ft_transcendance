import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  AuthenticatedGuard,
  IntraAuthGuards,
} from '../guards/intra-auth.guards';
import { User } from '../../entities';

import { HttpService as NestHttpService } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpService: NestHttpService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * GET /auth/login
   * This is the route the user will visit to authenticate
   */
  @Get('login')
  @UseGuards(IntraAuthGuards)
  login() {
    return;
  }

  /**
   * GET /auth/redirect
   * This is the redirect URL the OAuth2 Provider will call.
   */
  @Get('redirect')
  @UseGuards(IntraAuthGuards)
  redirect(@Res() res: Response, @Req() req: Request) {
    const user = req.user as User;
    console.log('redirect controller, accessToken : ', user.accessToken);
    res.cookie('accessToken', user.accessToken, {
      httpOnly: false,
      secure: false,
    }); // Set accessToken in cookie
    res.cookie('username', user.username, {
      httpOnly: false,
      secure: false,
    }); // Set accessToken in cookie
    res.redirect(`http://${process.env.IP}:3000/home`);
    // res.sendStatus(200);
  }

  /**
   * GET /auth/status
   * Retrieve the auth status
   */
  @Get('status')
  status(@Req() req: Request) {
    return (req.isAuthenticated());
  }

  /**
   * GET /auth/logout
   * Logging the user out
   */
  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log('LOGOUT CONTROLLER');

    await new Promise<void>((resolve, reject) => {
      req.logOut((err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Delete cookie 'connect.sid' on client side
    res.clearCookie('connect.sid');

    // Redirect on login page
    res.redirect('http://localhost:3000/login');
  }

  @Get('testlogin')
  async testlogin(@Res() res: Response, @Req() req: Request) {
    this.usersService.createUser('testUser');
    res.cookie('accessToken', 'test', {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
    }); // Set accessToken in cookie
    res.cookie('username', 'testUser', {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
    }); // Set username in cookie
    res.redirect(`http://${process.env.IP}:3000/home`);
  }
}
