"use server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

import { currentUser } from "@clerk/nextjs";

import Stripe from "stripe";

export const checkOut = async ({ courseId }: { courseId: string }) => {
    try {
        const user = await currentUser();
        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return { success: false, error: "Unauthorized" };
        }
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true
            }
        });
        if (!course) {
            return { success: false, error: "Course not found" };
        }
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            }
        });
        if (purchase) {
            return { success: false, error: "Already purchased" };
        }
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: course.title,
                        description: course.description!
                    },
                    unit_amount: Math.round(course.price! * 100)
                }
            }
        ];
        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id
            },
            select: {
                stripeCustomerId: true
            }
        });
        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress
            });
            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id
                }
            });
        }
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?cancel=1`,
            metadata: {
                courseId: course.id,
                userId: user.id
            }
        });
        return { success: true, url: session.url };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
