import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  avatar_url: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', ''),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', ''),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL', ''),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    
    if (!emails || !emails[0] || !name) {
      return done(new Error('Missing required profile information'), false);
    }

    const user: GoogleUser = {
      googleId: id,
      email: emails[0].value,
      name: `${name.givenName || ''} ${name.familyName || ''}`.trim(),
      avatar_url: photos && photos[0] ? photos[0].value : '',
    };

    try {
      const existingUser = await this.authService.findOrCreateGoogleUser(user);
      done(null, existingUser);
    } catch (error) {
      done(error instanceof Error ? error : new Error('Authentication failed'), false);
    }
  }
}
