import { redirect } from 'next/navigation'

import { stripe } from '../../../lib/stripe'
import SuccessClient from './SuccessClient'
import { createSubscription } from '@/lib/action/subscriptions'

export default async function Success({ searchParams }) {
    const { session_id } = await searchParams

    if (!session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)')

    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items']
    })

    const { status,metadata, customer_details:{email: customerEmail}, line_items, amount_total, currency } = session

    if (status === 'open') {
        return redirect('/plans')
    }

    if (status === 'complete' || status === 'no_payment_required') {
        const lineItem = line_items?.data?.[0]

        const subsInfo = {
            email:customerEmail,
            planId: metadata.planId,
        }

        const result = await createSubscription(subsInfo);
        console.log(result)

        // Update the user table about the new plan.

        return (
            <SuccessClient
                customerEmail={customer_details?.email}
                planName={lineItem?.description || 'Your Plan'}
                amountTotal={amount_total}
                currency={currency}
                interval={lineItem?.price?.recurring?.interval}
            />
        )
    }

    return redirect('/plans')
}
