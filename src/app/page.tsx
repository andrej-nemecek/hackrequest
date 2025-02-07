import { UserForm } from "@/components/user-form";
import { db } from "@/db/db";
import { users } from "@/db/schema";

const Home = async () => {
    const usersData = await db.select().from(users);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 flex-col">
            <h1 className="font-bold text-xl">Users</h1>
            <UserForm />
            <h2 className="font-bold text-xl mt-4">List</h2>
            {usersData.map((user) => (
                <div key={user.id}>
                    {user.fullName}: {user.phone}
                </div>
            ))}
        </div>
    );
};

export default Home;
