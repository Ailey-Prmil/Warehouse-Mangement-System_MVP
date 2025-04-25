import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { customerOrderDetail } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;

type OrderIdParams = {
  params: {
    orderId: string;
  };
};
export async function GET(request: NextRequest, { params }: OrderIdParams) {
  const orderId = Number(params.orderId);

  // if (!orderId) {
  //   return NextResponse.json(
  //     { message: "Order ID is required" },
  //     { status: 400 }
  //   );
  // }

  try {
    const orderDetails = await db
      .select({
        productId: customerOrderDetail.productId,
        quantity: customerOrderDetail.quantity,
      })
      .from(customerOrderDetail)
      .where(eq(customerOrderDetail.customerOrderId, orderId));
    if (!orderDetails || orderDetails.length === 0) {
      return NextResponse.json(
        { message: `No order found with ID ${orderId}` },
        { status: 404 }
      );
    }

    const orderDetailsResponse = {
      orderId: orderId,
      details: orderDetails,
    };
    return NextResponse.json(orderDetailsResponse, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}
// this table uses mock data, so POST and PUT are not essential
// export async function POST(request: NextRequest) {
//   const body = await request.json();
//   const { orderId, productId, quantity } = body;

//   if (!orderId || !productId || !quantity) {
//     return NextResponse.json(
//       { message: "Order ID, Product ID and Quantity are required" },
//       { status: 400 }
//     );
//   }

//   try {
//     const newOrderDetail = await db.insert(customerOrderDetail).values({
//       customerOrderId: orderId,
//       productId: productId,
//       quantity: quantity,
//     });
//     return NextResponse.json(newOrderDetail, {
//       status: 201,
//     });
//   } catch (error) {
//     console.error("Error inserting data:", error);
//     return NextResponse.json(
//       { message: "Error inserting data" },
//       { status: 500 }
//     );
//   }
// }
