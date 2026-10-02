const { z } = require('zod');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\\-])[A-Za-z\d@$!%*?&_\\-]{8,}$/;
const registerSchema = z.object({
    name : z.string().min(3).max(80),
    email: z.email({ message: "Invalid email address" }),
    password : z.string().regex(passwordRegex, { message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." }),
    userName : z.string().min(3, {message : 'Uername must be at least 3 characters'}).max(25)
})


const loginSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password : z.string().min(2, {message : 'Invalid Password'})
})

module.exports = {registerSchema, loginSchema}