import bcrypt from 'bcryptjs'

// A function rather than a constant so the admin password is read after dotenv has loaded.
// The admin password stays private; John and Jane are the public demo logins.
const getUsers = (adminPassword: string) => [
    {
        name: 'Admin User',
        email: 'admin@email.com',
        password: bcrypt.hashSync(adminPassword, 10),
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@email.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    },
    {
        name: 'Jane Doe',
        email: 'jane@email.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    },
]

export default getUsers
