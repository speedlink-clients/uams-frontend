import { Link } from "react-router";
import useAuthStore from "@stores/auth.store";
import { AuthHooks } from "@hooks/auth.hook";
import useLoginForm from "@forms/auth/login.form";
import type { LoginFormData } from "@schemas/auth/login.schema";
import { PasswordInput } from "@components/ui/password-input";

import { Box, Flex, Text, Image, Input, Field, Button, Stack, Span, Separator, Heading } from "@chakra-ui/react";

const LoginPage = () => {
    const { setAuth } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useLoginForm();

    const { mutate: login, isPending: isLoading } = AuthHooks.useLogin({
        onSuccess: (response) => {
            setAuth({
                token: response.data.token,
                expireAt: response.data.expiresIn,
                user: response.data.user,
            });

            const userRoles = response.data.user.roles || [response.data.user.role].filter(Boolean) as string[];

            if (userRoles.includes("STUDENT")) {
                window.location.href = "/student";
            } else if (userRoles.includes("STAFF")) {
                if (userRoles.includes("DEPARTMENT_ADMIN")) {
                    window.location.href = "/departmental";
                } else {
                    window.location.href = "/lecturer";
                }
            } else {
                window.location.href = "/";
            }
        },
    });

    const onSubmit = (formData: LoginFormData) => {
        login(formData);
    };

    return (
        <Flex minH="100vh" w="full" bg="white" fontFamily="'Inter'">
            {/* Left Side - Campus Image */}
            <Box display={{ base: "none", lg: "block" }} w="65%" position="relative">
                <Image
                    src="/images/slider.jpeg"
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
                <Stack
                    w="full"
                    maxW="md"
                    p={{ base: "8", lg: "12" }}
                    gap="6"
                >
                    {/* Logo */}
                    <Flex justifyContent="center" >
                        <Image
                            src="/images/uphcscLG.png"
                            alt="Logo"
                            h="12"
                            w="auto"
                            borderRadius="md"
                        />
                    </Flex>

                    {/* Heading */}
                    <Box textAlign="center" >
                        <Heading size="3xl" fontWeight="black" color="#1e293b">
                            Login
                        </Heading>
                        <Text fontSize="14px" fontWeight="medium" color="fg.subtle">
                            Welcome back please login to your account
                        </Text>
                    </Box>

                    <Stack gap="6" asChild color="black" colorPalette={"accent"}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Email */}
                            <Field.Root invalid={!!errors.email}>
                                <Field.Label>
                                    Email Address
                                </Field.Label>
                                <Input
                                    type="email"
                                    placeholder="Enter Email"
                                    {...register("email")}
                                    disabled={isLoading}
                                    size="xl"
                                />
                                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                            </Field.Root>


                            {/* Password */}
                            <Field.Root invalid={!!errors.password}>
                                <Field.Label>
                                    Password
                                </Field.Label>
                                <PasswordInput
                                    placeholder="Enter Password"
                                    {...register("password")}
                                    disabled={isLoading}
                                    size="xl"
                                />
                                <Field.ErrorText>
                                    {errors.password?.message}
                                </Field.ErrorText>

                                <Field.HelperText textAlign={"right"} w="full">Forgot Password?{" "}
                                    <Span asChild color="blue.500" fontWeight="medium" textDecor={"underline"}>
                                        <Link to="/forgot-password">Click Here</Link>
                                    </Span>
                                </Field.HelperText>
                            </Field.Root>



                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="xl"
                                loading={isLoading}
                                loadingText="Logging in..."
                                disabled={isLoading}
                                cursor={isLoading ? "not-allowed" : "pointer"}
                            >
                                Login
                            </Button>
                        </form>
                    </Stack>

                    <Separator />

                    <Text color="fg.subtle" textAlign={"center"}>
                        Are you a student?{" "}
                        <Span asChild color="blue.500" fontWeight="medium" textDecor={"underline"}>
                            <Link to="/register">Verify your account</Link>
                        </Span>
                    </Text>

                </Stack>
            </Flex>
        </Flex >
    );
};

export default LoginPage;