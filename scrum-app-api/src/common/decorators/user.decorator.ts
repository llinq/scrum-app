import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../../modules/user/user.entity';

interface RequestWithUser {
  user: IUser;
}

export const CurrentUser = createParamDecorator(
  (data: keyof IUser | undefined, ctx: ExecutionContext): IUser | IUser[keyof IUser] => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user: IUser = request.user;

    if (!user) {
      throw new Error('User not found in request. Make sure JwtAuthGuard is applied.');
    }

    return data ? user[data] : user;
  },
);