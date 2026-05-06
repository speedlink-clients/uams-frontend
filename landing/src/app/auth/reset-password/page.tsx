import { Link, useNavigate, useLocation } from "react-router";
import { useResetPasswordForm } from "@forms/auth.form";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Button, Stack, Span, Heading, Field, Icon } from "@chakra-ui/react";
import { PasswordInput } from "@components/ui/password-input";
import { useResetPassword } from "@hooks/auth.hook";
import { type ResetPasswordFormData } from "@type/auth.type";
import { LuLockKeyhole } from "react-icons/lu";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get email and verification token from location state
    const email = location.state?.email || "";
    const token = location.state?.token || "";

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useResetPasswordForm();

    const password = watch("password");

    const { mutate: resetPassword, isPending: isLoading } = useResetPassword({
        onSuccess: () => {
            toaster.create({
                title: "Success",
                description: "Your password has been reset successfully.",
                type: "success",
            });
            // Redirect to login after successful reset
            navigate("/auth/login");
        }
    });

    const onSubmit = (data: ResetPasswordFormData) => {
        if (!email) {
            toaster.create({ title: "Error", description: "Email context missing. Please start over.", type: "error" });
            return;
        }
        resetPassword({ email, token, password: data.password });
    };

    return (
         <Flex
            minH="100vh"
            w="full"
            bg="bg.subtle"
            py="20"
            justify={"center"}
            align={"center"}

        >

            <Stack
                w={{ base: "full", lg: "xl" }}
                align={"center"}
                gap="12"
                p="12"
                bg="bg"
                rounded="md"
                border="xs"
                borderColor={"border.muted"}
            >
                    <Icon
                        as={LuLockKeyhole}
                        w={24}
                        h={24}
                        strokeWidth="1"
                    />
                    {/* Heading */}
                    <Box textAlign="center" >
                        <Heading size="3xl" fontWeight="black">
                            Reset Password
                        </Heading>
                        <Text fontSize="sm" fontWeight="medium" color="fg.subtle">
                            Create a new password for your account
                        </Text>
                    </Box>

                    <Stack gap="6" asChild color="black" colorPalette={"accent"} w="full">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* New Password */}
                            <Field.Root invalid={!!errors.password}>
                                <Field.Label>New Password</Field.Label>
                                <PasswordInput
                                    placeholder="Enter New Password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 8, message: "Password must be at least 8 characters" }
                                    })}
                                    disabled={isLoading}
                                    size="xl"
                                    _placeholder={{ color: "fg.subtle" }}
                                />
                                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                            </Field.Root>

                            {/* Confirm Password */}
                            <Field.Root invalid={!!errors.confirmPassword}>
                                <Field.Label>Confirm Password</Field.Label>
                                <PasswordInput
                                    placeholder="Confirm New Password"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (value) => value === password || "Passwords do not match"
                                    })}
                                    disabled={isLoading}
                                    size="xl"
                                    _placeholder={{ color: "fg.subtle" }}
                                />
                                <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
                            </Field.Root>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="xl"
                                w="full"
                                loading={isLoading}
                                loadingText="Resetting..."
                                disabled={isLoading || !watch("password") || !watch("confirmPassword")}
                            >
                                Reset Password
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

        </Flex>
    );
};

export default ResetPasswordPage;