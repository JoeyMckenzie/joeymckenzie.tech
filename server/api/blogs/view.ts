export default defineEventHandler(async (event) => {
  // const existingViewCount = await db.select().from(viewCounts).where(eq(event.));

  // const updatedUserId: { updatedId: number }[] = await db
  //   .update(viewCounts)
  //   .set({ name: 'Mr. Dan' })
  //   .where(eq(users.name, 'Dan'))
  //   .returning({ updatedId: users.id });

  return {
    foo: 'bar',
  };
});
