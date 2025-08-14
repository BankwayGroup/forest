"use server";

export default async function DashboardPage() {
  return (
    <>
      <div className="flex space-x-4">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Dashboard
        </h1>
      </div>
      <p>
        Here will be the cards with information: how many products were sold today, the number of orders, etc.
      </p>
    </>
  );
}
