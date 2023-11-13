import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      id: "ASJDLSADSJALDJASLKJD",
      email: "alice@prisma.io",
      first_name: "Alice",
      last_name: "Prisma",
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
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      id: "LKJDSFLSAKDJFASLAL",
      email: "bob@prisma.io",
      first_name: "Bob",
      last_name: "Prisma",
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
          price: 20,
          priceId: "price_1OBmXmIN7xQGjCuLOBGhebg9",
          productId: "bob",
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
      first_name: "Max",
      last_name: "Prisma",
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
