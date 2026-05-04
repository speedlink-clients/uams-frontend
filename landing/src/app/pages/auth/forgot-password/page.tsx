import { Link } from "react-router";
import { AuthHooks } from "@hooks/auth.hook";
import { useForm } from "react-hook-form";
import { toaster } from "@components/ui/toaster";

import { Box, Flex, Text, Image, Input, Field, Button, Stack, Span, Heading } from "@chakra-ui/react";

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPasswordPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>();

    const { mutate: forgotPassword, isPending: isLoading, isSuccess } = AuthHooks.useForgotPassword({
        onSuccess: (response) => {
            toaster.create({
                title: "Success",
                description: response.message || "A password reset link has been sent to your email.",
                type: "success",
            });
        },
    });

    const onSubmit = (formData: ForgotPasswordFormData) => {
        forgotPassword(formData);
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

            {/* Right Side - Forgot Password Form */}
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
                    gap="12"
                >
                    {/* Logo */}
                    <Flex justifyContent="center" >
                        <Image
                            src="/public/images/uphcscLG.png"
                            alt="Logo"
                            h="12"
                            w="auto"
                            borderRadius="md"
                        />
                    </Flex>

                    {/* Heading */}
                    <Box textAlign="center" >
                        <Heading size="3xl" fontWeight="black">
                            Forgot Password
                        </Heading>
                        <Text fontSize="14px" fontWeight="medium" color="fg.subtle">
                            Enter your email to receive a password reset link
                        </Text>
                    </Box>

                    {isSuccess ? (
                        <Box p="6" bg="green.50" border="1px solid" borderColor="green.200" borderRadius="xl" textAlign="center">
                            <Text color="green.700" fontWeight="medium" mb="4">
                                If an account exists for that email, we have sent password reset instructions.
                            </Text>
                            <Button asChild variant="outline" w="full" size="lg">
                                <Link to="/">Return to Login</Link>
                            </Button>
                        </Box>
                    ) : (
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
                                        {...register("email", { 
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        disabled={isLoading}
                                        size="xl"
                                        _placeholder={{color:"fg.subtle"}}
                                    />
                                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                                </Field.Root>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    size="xl"
                                    loading={isLoading}
                                    loadingText="Sending..."
                                    disabled={isLoading}
                                    cursor={isLoading ? "not-allowed" : "pointer"}
                                >
                                    Send Reset Link
                                </Button>
                            </form>
                        </Stack>
                    )}

                    <Text color="fg.subtle" textAlign={"center"}>
                        Remember your password?{" "}
                        <Span asChild color="blue.500" fontWeight="medium" textDecor={"underline"}>
                            <Link to="/">Back to Login</Link>
                        </Span>
                    </Text>

                </Stack>
            </Flex>
        </Flex >
    );
};

export default ForgotPasswordPage;