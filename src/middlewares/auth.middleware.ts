import { NextFunction, Request, Response } from 'express';
import { prisma } from '@/utils/prisma';
import { getAccessTokenFromHeaders } from '@/utils/headers';
import { jwtVerify } from '@/utils/jwt';
import { redis } from '@/database';

export const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    Object.assign(req, { context: {} })

    const { accessToken } = getAccessTokenFromHeaders(req.headers)
    if (!accessToken) return next()

    const { id } = jwtVerify({ accessToken })
    if (!id) return next()

    const isAccessTokenExpired = await redis.client.get(
      `expiredToken:${accessToken}`
    )
    if (isAccessTokenExpired) return next()

    const user = await prisma.user.findUnique({
      where: { id },
    })
    
    if (!user) return next()

    Object.assign(req, {
      context: {
        user,
        accessToken
      }
    })

    return next()
  } catch (error) {
    return next()
  }
}
