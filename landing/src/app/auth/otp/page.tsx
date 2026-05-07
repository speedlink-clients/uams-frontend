import { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Controller } from "react-hook-form";
import { useOtpForm } from "@forms/auth.form";
import { toaster } from "@components/ui/toaster";
import { Flex, Text, Button, Stack, Span, Heading, PinInput, Icon, Box } from "@chakra-ui/react";
import { useVerifyOtp, useResendOtp } from "@hooks/auth.hook";
import { type OtpFormData } from "@type/auth.type";
import { LuMail, LuPencilLine } from "react-icons/lu";

const OtpPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get context from navigation state
    const email = location.state?.email || "";
    const flow = location.state?.flow || "login"; // "login" or "reset"

    const {
        control,
        handleSubmit,
        watch
    } = useOtpForm();

    const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp({
        onSuccess: (response) => {
            if (flow === "reset") {
                const token = response.data.token;
                // Redirect to reset-password with Token and email in state
                navigate(`/auth/reset-password`, { state: { token, email } });
                return;
            }

            // Standard login flow or other flows could be handled here if needed,
            // but the user requested removal of L43-78 logic.
        },
    });

    const { mutate: resendOtp, isPending: isResending } = useResendOtp({
        onSuccess: (response) => {
            toaster.create({
                title: "OTP Resent",
                description: response.message || "A new code has been sent to your email.",
                type: "success",
            });
        }
    });

    const onSubmit = useCallback((data: OtpFormData) => {
        if (data.otp.length < 6) {
            toaster.create({ title: "Error", description: "Please enter the full 6-digit code.", type: "error" });
            return;
        }
        if (!email) {
            toaster.create({ title: "Error", description: "Email context missing. Please go back and try again.", type: "error" });
            return;
        }
        verifyOtp({ email, otp: data.otp });
    }, [email, verifyOtp]);

    const handleResend = useCallback(() => {
        if (!email) {
            toaster.create({ title: "Error", description: "Email context missing.", type: "error" });
            return;
        }
        resendOtp({ email });
    }, [email, resendOtp]);

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
                <Stack align={"center"} gap="4">
                    <Icon
                        as={LuMail}
                        w={24}
                        h={24}
                        strokeWidth="1"
                    // color="accent"
                    />
                    <Box textAlign={"center"} w="full">
                        <Heading size="3xl" fontWeight="black">
                            Verify OTP
                        </Heading>
                        <Text fontSize="sm" fontWeight="medium" color="fg.subtle">
                            A 6-digit code has been sent to {" "}
                            <Flex asChild fontWeight="bold" color="black" align={"center"} gap="1">
                                <Link to="/auth/forgot-password">{email || "your email"}<LuPencilLine /></Link>
                            </Flex>
                        </Text>
                    </Box>
                </Stack>

                <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                    <Stack gap="8" align="center" w="full">
                        <Controller
                            name="otp"
                            control={control}
                            rules={{ required: true, minLength: 6 }}
                            render={({ field }) => (
                                <PinInput.Root
                                    attached
                                    colorPalette={"accent"}
                                    size="xl"
                                    disabled={isVerifying || isResending || !email}
                                    value={Array.from({ length: 6 }, (_, i) => (field.value || "")[i] || "")}
                                    onValueChange={(e) => field.onChange(e.value.join(""))}
                                >
                                    <PinInput.HiddenInput />
                                    <PinInput.Control>
                                        <PinInput.Input index={0} />
                                        <PinInput.Input index={1} />
                                        <PinInput.Input index={2} />
                                        <PinInput.Input index={3} />
                                        <PinInput.Input index={4} />
                                        <PinInput.Input index={5} />
                                    </PinInput.Control>
                                </PinInput.Root>
                            )}
                        />

                        <Button
                            type="submit"
                            size="xl"
                            w="full"
                            colorPalette="accent"
                            loading={isVerifying}
                            loadingText="Verifying..."
                            disabled={isVerifying || isResending || !email || watch("otp").length < 6}
                        >
                            Verify & Proceed
                        </Button>
                    </Stack>
                </form>

                <Text color="fg.subtle" textAlign={"center"}>
                    Didn't receive the code?{" "}
                    <Button
                        variant="ghost"
                        size="sm"
                        colorPalette="accent"
                        fontWeight="bold"
                        loading={isResending}
                        onClick={handleResend}
                    >
                        Resend OTP
                    </Button>
                </Text>

                <Text color="fg.subtle" textAlign={"center"}>
                    <Span asChild color="accent" fontWeight="medium" textDecor={"underline"}>
                        <Link to="/auth/login">Back to Login</Link>
                    </Span>
                </Text>
            </Stack>

        </Flex>
    );
};

export default OtpPage;