import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_ID = {
    'seeker_pro':'price_1UQK37Rp3nTAwgWxFSretLxm',
    'seeker_premium':'price_1UQKPuRp3nTAwgWxF878lGqx',
    'recruiter_growth':'price_1UQKSfRp3nTAwgWxYgRguOnx',
    'recruiter_enterprise':'price_1UQKTqRp3nTAwgWxzEfrjEUH'
}