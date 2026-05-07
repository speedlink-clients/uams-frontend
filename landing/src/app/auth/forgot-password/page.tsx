import { Link, useNavigate } from "react-router";
import { useForgotPassword } from "@hooks/auth.hook";
import { useForgotPasswordForm } from "@forms/auth.form";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Input, Field, Button, Stack, Span, Heading, Icon } from "@chakra-ui/react";

import { type ForgotPasswordFormData } from "@type/auth.type";
import { LuLock } from "react-icons/lu";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        formState: { errors },
    } = useForgotPasswordForm();

    const { mutate: forgotPassword, isPending: isLoading } = useForgotPassword({
        onSuccess: (response) => {
            toaster.create({
                title: "Success",
                description: response.message || "A password reset link has been sent to your email.",
                type: "success",
            });

            // Redirect to OTP page with email in state and flow identifier
            const email = getValues("email");
            navigate("/auth/otp", { state: { email, flow: "reset" } });
        }
    });

    const onSubmit = (formData: ForgotPasswordFormData) => {
        forgotPassword(formData);
    };

    return (
        <Flex
            minH="100vh"
            w="full"
            bg="bg.subtle"
            py={{ base: "4", md: "20" }}
            px={{ base: "4", md: 0 }}
            justify={"center"}
            align={{ base: "start", md: "center" }}

        >

            <Stack
                w={{ base: "full", lg: "xl" }}
                align={"center"}
                gap="12"
                p={{ base: "6", md: "12" }}
                bg="bg"
                rounded="md"
                border="xs"
                borderColor={"border.muted"}
            >
                {/* Heading */}
                <Stack gap="6" align={"center"} >
                    <Icon
                        as={LuLock}
                        w={24}
                        h={24}
                        strokeWidth="1px"
                    />
                    <Box textAlign={"center"}>
                        <Heading size="3xl" fontWeight="black">
                            Forgot Password
                        </Heading>
                        <Text fontSize="14px" fontWeight="medium" color="fg.subtle">
                            Enter your email to receive a verification code
                        </Text>
                    </Box>
                </Stack>
                <Stack gap="6" asChild color="black" colorPalette={"accent"} w="full">
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
                                _placeholder={{ color: "fg.subtle" }}
                            />
                            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                        </Field.Root>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            size="xl"
                            w="full"
                            loading={isLoading}
                            loadingText="Sending..."
                            disabled={isLoading || !watch("email")}
                        >
                            Send OTP
                        </Button>
                    </form>
                </Stack>

                <Text color="fg.subtle" textAlign={"center"}>
                    Remember your password?{" "}
                    <Span asChild color="accent" fontWeight="medium" textDecor={"underline"}>
                        <Link to="/auth/login">Back to Login</Link>
                    </Span>
                </Text>

            </Stack>

        </Flex >
    );
};

export default ForgotPasswordPage;