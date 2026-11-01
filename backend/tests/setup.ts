import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { afterAll, afterEach, beforeAll } from 'vitest'

// Each test file gets its own throwaway MongoDB, emptied between tests
let mongo: MongoMemoryServer

beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-the-checks'
    mongo = await MongoMemoryServer.create()
    await mongoose.connect(mongo.getUri())
})

afterEach(async () => {
    const collections = await mongoose.connection.db!.collections()
    await Promise.all(collections.map((c) => c.deleteMany({})))
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongo.stop()
})
