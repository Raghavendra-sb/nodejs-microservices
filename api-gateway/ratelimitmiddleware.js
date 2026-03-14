import ratelimit from 'express-rate-limit';
 
export const limiter = ratelimit(
    {
        windowMs: 60 * 1000, // 1 minutes
        max: 3, // limit each IP to 3 requests per windowMs
        message: 'Too many requests from this IP, please try again after 1 minute'
    }
)

