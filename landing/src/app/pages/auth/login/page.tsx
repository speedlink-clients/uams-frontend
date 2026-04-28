import { useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router";
import useAuthStore from "@stores/auth.store";
import { AuthHooks } from "@hooks/auth.hook";
import useLoginForm from "@forms/auth/login.form";
import type { LoginFormData } from "@schemas/auth/login.schema";
import { PasswordInput } from "@components/ui/password-input";

import { Box, Flex, Text, Image, Spinner, Input } from "@chakra-ui/react";

const LoginPage = () => {
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useLoginForm();

    const { mutate: login, isPending: isLoading, error: mutationError } = AuthHooks.useLogin({
        onSuccess: (data) => {
            localStorage.setItem("loginEmail", data.user.email);

            setAuth({
                token: data.token,
                role: data.user.role,
                tenantId: data.permissions.tenantId,
                universityId: data.permissions.universityId,
                facultyId: data.permissions.facultyId || null,
                departmentId: data.permissions.departmentId || null,
                email: data.user.email,
                username: data.user.fullName,
                user: data.user,
            });

            navigate("/dashboard");
        },
        onError: () => {
            localStorage.removeItem("loginEmail");
        },
    });

    const onSubmit = (formData: LoginFormData) => {
        login(formData);
    };

    // Derive a user-friendly error message from the mutation error
    const getErrorMessage = (): string | null => {
        if (!mutationError) return null;

        const err = mutationError as any;
        if (err.response) {
            if (err.response.status === 401) {
                return "Invalid email or password. Please try again.";
            } else if (err.response.status === 400) {
                return err.response.data?.message || "Invalid request. Please check your input.";
            } else if (err.response.status === 500) {
                return "Server error. Please try again later.";
            }
            return err.response.data?.message || "Login failed. Please try again.";
        } else if (err.request) {
            return "Network error. Please check your connection.";
        }
        return "An unexpected error occurred. Please try again.";
    };

    const errorMessage = getErrorMessage();

    return (
        <Flex minH="100vh" w="full" bg="white" fontFamily="'Inter'">
            {/* Left Side - Campus Image */}
            <Box display={{ base: "none", lg: "block" }} w="65%" position="relative">
                <Image
                    src="/public/images/slider.jpeg"
                    alt="Modern University Campus"
                    position="absolute"
                    inset="0"
                    w="full"
                    h="full"
                    objectFit="cover"
                />
                <Box position="absolute" inset="0" bg="blackAlpha.100" />
            </Box>

            {/* Right Side - Login Form */}
            <Flex
                w={{ base: "full", lg: "35%" }}
                alignItems="center"
                justifyContent="center"
                p="6"
                bg={{ base: "#f8fafc", lg: "white" }}
            >
                <Box
                    w="full"
                    maxW="md"
                    bg="#f9fbff"
                    p={{ base: "8", lg: "12" }}
                    borderRadius="48px"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    {/* Logo */}
                    <Flex justifyContent="center" mb="12">
                        <Image
                            src="/public/images/uphcscLG.png"
                            alt="Logo"
                            h="12"
                            w="auto"
                            borderRadius="md"
                        />
                    </Flex>

                    {/* Heading */}
                    <Box textAlign="center" mb="10">
                        <Text fontSize="2xl" fontWeight="black" color="#1e293b" mb="2">
                            Login
                        </Text>
                        <Text fontSize="14px" fontWeight="medium" color="gray.400">
                            Welcome back please login to your account
                        </Text>
                    </Box>

                    {/* Server Error */}
                    {errorMessage && (
                        <Box mb="6" p="4" bg="red.50" border="1px solid" borderColor="red.200" borderRadius="22px">
                            <Text color="red.600" fontSize="sm" textAlign="center" fontWeight="bold">
                                {errorMessage}
                            </Text>
                        </Box>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Flex direction="column" gap="6">
                            {/* Email */}
                            <Box>
                                <Box position="relative">
                                    <Input
                                        type="email"
                                        placeholder="Enter Email"
                                        {...register("email")}
                                        disabled={isLoading}
                                        w="full"
                                        bg="white"
                                        border="1px solid"
                                        borderColor={errors.email ? "red.400" : "gray.200"}
                                        borderRadius="22px"
                                        py="4.5"
                                        px="7"
                                        fontSize="15px"
                                        fontWeight="medium"
                                        color="#1e293b"
                                        outline="none"
                                        transition="all 0.2s"
                                        _placeholder={{ color: "gray.300" }}
                                        _focus={{ borderColor: "#1d76d2" }}
                                        _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                                    />
                                    <Box position="absolute" right="7" top="50%" transform="translateY(-50%)" color="gray.300">
                                        <User size={20} strokeWidth={2.5} />
                                    </Box>
                                </Box>
                                {errors.email && (
                                    <Text color="red.500" fontSize="xs" mt="1" px="4" fontWeight="medium">
                                        {errors.email.message}
                                    </Text>
                                )}
                            </Box>

                            {/* Password */}
                            <Box>
                                <PasswordInput
                                    placeholder="Enter Password"
                                    {...register("password")}
                                    disabled={isLoading}
                                    w="full"
                                    bg="white"
                                    border="1px solid"
                                    borderColor={errors.password ? "red.400" : "gray.200"}
                                    borderRadius="22px"
                                    py="4.5"
                                    px="7"
                                    fontSize="15px"
                                    fontWeight="medium"
                                    color="#1e293b"
                                    outline="none"
                                    transition="all 0.2s"
                                    _placeholder={{ color: "gray.300" }}
                                    _focus={{ borderColor: "#1d76d2" }}
                                    _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                                />
                                {errors.password && (
                                    <Text color="red.500" fontSize="xs" mt="1" px="4" fontWeight="medium">
                                        {errors.password.message}
                                    </Text>
                                )}
                            </Box>

                            {/* Submit Button */}
                            <Flex
                                as="button"
                                type="submit"
                                w="full"
                                bg="#1d76d2"
                                color="white"
                                py="5"
                                borderRadius="22px"
                                fontSize="16px"
                                fontWeight="black"
                                transition="all 0.2s"
                                mt="6"
                                border="none"
                                cursor={isLoading ? "not-allowed" : "pointer"}
                                alignItems="center"
                                justifyContent="center"
                                _hover={{ bg: "#1565c0" }}
                                opacity={isLoading ? 0.7 : 1}
                                _active={{ transform: "scale(0.98)" }}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner size="sm" mr="3" />
                                        Logging in...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </Flex>
                        </Flex>
                    </form>

                    {/* Forgot Password */}
                    <Box mt="10" textAlign="center">
                        <Text fontSize="13px" fontWeight="bold" color="gray.400">
                            Forgot Password?{" "}
                            <Text
                                as="span"
                                color="#3b82f6"
                                _hover={{ color: "#1d76d2", textDecoration: "underline" }}
                                transition="all 0.2s"
                                onClick={() => { if (!isLoading) navigate('/forgot-password'); }}
                                cursor="pointer"
                                opacity={isLoading ? 0.6 : 1}
                            >
                                Click Here
                            </Text>
                        </Text>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
};

export default LoginPage;