import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      id: "ASJDLSADSJALDJASLKJD",
      email: "alice@prisma.io",
      stripe_customer_id: "cus_OzobuISR25yCn6",
      name: "Alice",
      profile_picture_url: "https://i.imgur.com/BdN9y8h.jpeg",
      handle: "alice",
      posts: {
        create: {
          caption: "My first post!",
          image: "https://i.imgur.com/2d8NQCY.jpeg",
          video: null,
          fileKey: null,
          isPaid: false,
        },
      },
    },
  });
  await prisma.user.upsert({
    where: { email: "maxtesting1999@gmail.com" },
    update: {},
    create: {
      id: "user_2YeB8LEE6uRSP0ekBTK6TvWzxCu",
      email: "maxtesting1999@gmail.com",
      stripe_customer_id: "cus_OzoaHUCkkabXcF",
      name: "Bob",
      profile_picture_url: "https://i.imgur.com/BdN9y8h.jpeg",
      handle: "bob",
      posts: {
        create: {
          caption: "YO this is bob!",
          image: "https://i.imgur.com/ozY3D3m.jpeg",
          video: null,
          fileKey: null,
          isPaid: false,
        },
      },
      subscriptionSetting: {
        create: {
          connectAccountId: "acct_1OEiR4RDu4b9PueH",
          isComplete: true,
          price: 20,
          productId: "prod_Ozm59u0jgWnPpu",
          priceId: "price_1OBmXmIN7xQGjCuLOBGhebg9",
        },
      },
    },
  });
  await prisma.user.upsert({
    where: { email: "max@prisma.io" },
    update: {},
    create: {
      id: "user_2W5yMCDxXqt6qvZZzOJ9LKNmHca",
      email: "max@prisma.io",
      stripe_customer_id: "cus_Ozocd5CWheamgv",
      name: "Max",
      profile_picture_url:
        "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yVzV5TTZjRmgxSU1WS0lkWjNIMUM4d2piaEYifQ",
      profile_header_url:
        "https://utfs.io/f/93e773d4-e1ad-4766-b4b9-2f5349b79040-1x98hn.JPG",
      handle: "max",
      posts: {
        create: {
          caption: "YO this is max!",
          image:
            "https://utfs.io/f/4d778816-f1d3-4b3f-92a2-2c4c9987168d-1x98be.jpg",
          video: null,
          fileKey: null,
          isPaid: false,
        },
      },
      subscriptionSetting: {
        create: {
          connectAccountId: "acct_1ODr6GIyNR7z2wEf",
          isComplete: true,
          productId: "prod_P2nG5XcGhHI0cG",
          priceId: "price_1OEhfpIN7xQGjCuLmCCq0xMF",
        },
      },
    },
  });
  await prisma.message.create({
    data: {
      senderId: "user_2YeB8LEE6uRSP0ekBTK6TvWzxCu",
      receiverId: "user_2W5yMCDxXqt6qvZZzOJ9LKNmHca",
      message: "Hello, this is a test message!",
      isTip: false,
      tipPrice: null,
      wasRead: false,
      wasNotified: false,
    },
  });
  await prisma.subscription.create({
    data: {
      subscriberId: "user_2YeB8LEE6uRSP0ekBTK6TvWzxCu",
      subscribedToId: "user_2W5yMCDxXqt6qvZZzOJ9LKNmHca",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
