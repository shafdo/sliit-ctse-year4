import { login, createUser } from "../src/controllers/user.controller";
import { createUserRepo, findUserByFilter } from "../src/repository/user.repository";
import { compareHash, hashText } from "../src/utils/bcrypt";
import { generateJWT } from "../src/utils/jwt";
import { Request, Response } from "express";

// Mocking external dependencies using Jest's mocking system
// This replaces the actual implementations with mock functions for testing
jest.mock("../src/repository/user.repository"); // Mock user database operations
jest.mock("../src/utils/bcrypt"); // Mock password hashing functions
jest.mock("../src/utils/jwt"); // Mock JWT token generation

// Mocking our custom response utility
jest.mock("../src/utils/response", () => ({
    __esModule: true, // This is TypeScript-specific for default exports
    default: jest.fn().mockImplementation(({ res, status, message, data }) => {
        // This mock implementation simulates what the real response utility does
        res.status(status).json({ status, message, data });
    })
}));

// Describe block creates a test suite grouping related tests
describe("User Controller", () => {
    // Declare variables we'll use in our tests
    let mockRequest: Partial<Request>; // Mock Express request object
    let mockResponse: any; // Mock Express response object
    let mockStatus: jest.Mock; // Mock for response.status()
    let mockJson: jest.Mock; // Mock for response.json()
    let mockCookie: jest.Mock; // Mock for response.cookie()

    // beforeEach runs before each test in this describe block
    beforeEach(() => {
        // Initialize our mock functions
        mockJson = jest.fn(); // Creates a mock function
        // mockReturnThis allows chaining like response.status().json()
        mockStatus = jest.fn().mockReturnThis(); 
        mockCookie = jest.fn();

        // Create our mock response object with the mock functions
        mockResponse = {
            status: mockStatus, // response.status() will use our mock
            json: mockJson,    // response.json() will use our mock
            cookie: mockCookie // response.cookie() will use our mock
        };
    });

    // afterEach runs after each test to clean up
    afterEach(() => {
        jest.clearAllMocks(); // Resets all mock functions between tests
    });

    // Nested describe block for login-related tests
    describe("login", () => {
        // it() defines an individual test case
        it("should return 401 if user does not exist", async () => {
            // Mock the repository to return null (user not found)
            (findUserByFilter as jest.Mock).mockResolvedValue(null);
            
            // Set up our mock request with test data
            mockRequest = {
                body: { email: "test@example.com", password: "wrongpass", role: "user" },
            };

            // Call the actual login function with our mock request/response
            await login(mockRequest as Request, mockResponse as Response);

            // Assertions - what we expect to happen:
            // 1. Should call response.status(401)
            expect(mockStatus).toHaveBeenCalledWith(401);
            // 2. Should return the correct error response
            expect(mockJson).toHaveBeenCalledWith({
                status: 401,
                message: "Invalid username or password",
                data: undefined
            });
        });
    });

    // Nested describe block for user creation tests
    describe("createUser", () => {
        it("should create a user and remove password from response", async () => {
            // Create mock user data that the repository would return
            const mockUserData = {
                _id: "123",
                username: "testuser",
                email: "test@example.com",
                role: "user",
                password: "hashedpass123", // This should be removed in response
            };

            // Mock the repository to return our test data
            (createUserRepo as jest.Mock).mockResolvedValue({
                status: 201, // HTTP 201 Created
                message: "User created",
                data: mockUserData
            });

            // Mock the password hashing function to return a fixed value
            (hashText as jest.Mock).mockReturnValue("hashedpass123");

            // Set up our test request
            mockRequest = {
                body: {
                    username: "testuser",
                    email: "test@example.com",
                    password: "pass123",
                    role: "user"
                },
            };

            // Call the actual createUser function
            await createUser(mockRequest as Request, mockResponse as Response);

            // Assertions:
            // 1. Should hash the password
            expect(hashText).toHaveBeenCalledWith("pass123");
            // 2. Should return status 201
            expect(mockStatus).toHaveBeenCalledWith(201);
            // 3. Should return the user data without password
            expect(mockJson).toHaveBeenCalledWith({
                status: 201,
                message: "User created",
                data: {
                    _id: "123",
                    username: "testuser",
                    email: "test@example.com",
                    role: "user",
                    // No password here - it should be removed
                },
            });
        });
    });

    // Simple example test to demonstrate basic testing
    describe('example test', () => {
        it('should work', () => {
            // Very basic assertion - just checks that 1+1=2
            expect(1 + 1).toBe(2);
        });
    });
});