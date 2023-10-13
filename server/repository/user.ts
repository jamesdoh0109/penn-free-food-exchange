import { prisma } from "@/lib/db";

export async function createUser(
  id: string,
  firstName: string,
  lastName: string,
  meadow: string,
  primaryEmail: string
): Promise<void> {
  await prisma.user.create({
    data: {
      id,
      firstName,
      lastName,
      meadow,
      primaryEmail,
      primaryPhone: null,
    },
  });
}

export async function updateUser(
  id: string,
  firstName: string,
  lastName: string,
  primaryEmail: string,
  primaryPhone: string | undefined
): Promise<void> {
  const data: {
    firstName: string;
    lastName: string;
    primaryEmail: string;
    primaryPhone: string | null;
  } = {
    firstName,
    lastName,
    primaryEmail,
    primaryPhone: null,
  };

  if (primaryPhone) {
    data.primaryPhone = primaryPhone; 
  }

  await prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({
    where: {
      id,
    },
  });
}