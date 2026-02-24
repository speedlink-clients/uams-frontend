import { useState } from "react";
import { Box, Flex, Text, Heading, Icon, Input, Image } from "@chakra-ui/react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import AuthBackground from "@components/auth/AuthBackground";
import AuthCard from "@components/auth/AuthCard";

interface ForgotPasswordFlowProps {
    onBackToLogin: () => void;
}

type RecoveryStep = "forgot-password" | "verify-code" | "reset-password" | "reset-success";

const ForgotPasswordFlow = ({ onBackToLogin }: ForgotPasswordFlowProps) => {
    const [internalStep, setInternalStep] = useState<RecoveryStep>("forgot-password");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const recoveryImages: Record<string, { src: string; alt: string }> = {
        "forgot-password": {
            src: `${import.meta.env.BASE_URL}assets/forgot-password.jpg`,
            alt: "Confused Man",
        },
        "verify-code": {
            src: `${import.meta.env.BASE_URL}assets/verify-code.png`,
            alt: "Verification",
        },
        "reset-password": {
            src: `${import.meta.env.BASE_URL}assets/reset-password.png`,
            alt: "Reset Password",
        },
        "reset-success": {
            src: `${import.meta.env.BASE_URL}assets/reset-success.jpg`,
            alt: "Success",
        },
    };
    const currentImage = recoveryImages[internalStep];

    const handleOtpChange = (index: number, val: string) => {
        if (val && !/^\d+$/.test(val)) return;

        const next = [...otp];

        if (!val) {
            next[index] = "";
            setOtp(next);
            return;
        }

        const digit = val.slice(-1);
        next[index] = digit;
        setOtp(next);

        if (digit && index < otp.length - 1) {
            const el = document.getElementById(`otp-${index + 1}`);
            el?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const el = document.getElementById(`otp-${index - 1}`);
            el?.focus();
        }
    };

    /* ─── Shared input styles ─── */
    const inputStyles = {
        bg: "white",
        border: "1px solid",
        borderColor: "gray.300",
        borderRadius: "xl",
        py: "7",
        px: "6",
        fontSize: "14px",
        fontWeight: "500",
        color: "#1e293b",
        _focus: {
            outline: "none",
            borderColor: "accent.500",
            boxShadow: "0 0 0 4px {colors.accent.100}",
        },
        _placeholder: { color: "gray.400" },
        transition: "all 0.2s",
    };

    /* ─── Shared primary button styles ─── */
    const primaryBtnStyle: React.CSSProperties = {
        width: "100%",
        padding: "16px 0",
        borderRadius: "12px",
        fontSize: "15px",
        fontWeight: 900,
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s",
        backgroundColor: "var(--chakra-colors-accent-500, #1273D4)",
        color: "white",
        boxShadow: "0 8px 20px rgba(18, 115, 212, 0.3)",
        textAlign: "center",
    };

    return (
        <Flex
            py="10"
            minH="100vh"
            w="100%"
            align="center"
            justify="center"
            position="relative"
        >
            <AuthBackground />
            <AuthCard>
                {/* Step illustration */}
                {currentImage && (
                    <Flex justify="center" mb="6">
                        <Image
                            src={currentImage.src}
                            alt={currentImage.alt}
                            maxH="160px"
                            objectFit="contain"
                            borderRadius="xl"
                        />
                    </Flex>
                )}
                {/* ─── Step 1: Forgot Password ─── */}
                {internalStep === "forgot-password" && (
                    <>
                        <Box textAlign="center" mb="10">
                            <Heading size="md" fontWeight="900" color="gray.800" mb="3">
                                Forgot Password
                            </Heading>
                            <Text fontSize="13px" fontWeight="500" color="gray.400">
                                Let's retrieve your password together
                            </Text>
                        </Box>

                        <Flex direction="column" gap="6">
                            <Box>
                                <Text fontSize="13px" fontWeight="700" color="#1e293b" mb="2" px="1">
                                    Email Address
                                </Text>
                                <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    {...inputStyles}
                                />
                            </Box>

                            <button
                                type="button"
                                onClick={() => setInternalStep("verify-code")}
                                style={primaryBtnStyle}
                            >
                                Send Code
                            </button>

                            <Flex
                                as="button"
                                align="center"
                                justify="center"
                                gap="2"
                                w="100%"
                                fontSize="13px"
                                fontWeight="700"
                                color="gray.400"
                                _hover={{ color: "#3b82f6" }}
                                transition="color 0.2s"
                                cursor="pointer"
                                onClick={onBackToLogin}
                                bg="transparent"
                                border="none"
                            >
                                <Icon as={ArrowLeft} boxSize="4" />
                                <Text>Back to login</Text>
                            </Flex>
                        </Flex>
                    </>
                )}

                {/* ─── Step 2: Verify Code ─── */}
                {internalStep === "verify-code" && (
                    <>
                        <Box textAlign="center" mb="10">
                            <Heading size="md" fontWeight="900" color="gray.800" mb="3">
                                Enter Verification Code
                            </Heading>
                            <Text fontSize="12px" fontWeight="500" color="gray.400">
                                We sent a code to{" "}
                                <Text as="span" fontWeight="700">
                                    youremail@provider.com
                                </Text>
                            </Text>
                        </Box>

                        <Flex direction="column" gap="8">
                            {/* OTP Inputs */}
                            <Flex justify="space-between" gap="2">
                                {otp.map((digit, i) => (
                                    <Input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        w="100%"
                                        h="48px"
                                        textAlign="center"
                                        border="1px solid"
                                        borderColor="gray.300"
                                        borderRadius="lg"
                                        fontSize="lg"
                                        fontWeight="700"
                                        color="#1e293b"
                                        _focus={{
                                            borderColor: "accent.500",
                                            boxShadow: "0 0 0 2px {colors.accent.100}",
                                            outline: "none",
                                        }}
                                    />
                                ))}
                            </Flex>

                            {/* Resend */}
                            <Box textAlign="center">
                                <Text fontSize="12px" fontWeight="700" color="gray.400">
                                    Didn't get the code?{" "}
                                    <Text
                                        as="span"
                                        color="#3b82f6"
                                        _hover={{ textDecoration: "underline" }}
                                        cursor="pointer"
                                    >
                                        Resend code
                                    </Text>
                                </Text>
                            </Box>

                            <button
                                type="button"
                                onClick={() => setInternalStep("reset-password")}
                                style={primaryBtnStyle}
                            >
                                Continue
                            </button>
                        </Flex>
                    </>
                )}

                {/* ─── Step 3: Reset Password ─── */}
                {internalStep === "reset-password" && (
                    <>
                        <Box textAlign="center" mb="10">
                            <Heading size="md" fontWeight="900" color="gray.800" mb="3">
                                Reset Password
                            </Heading>
                            <Text fontSize="12px" fontWeight="500" color="gray.400">
                                Update Password to enhance account security
                            </Text>
                        </Box>

                        <Flex direction="column" gap="6">
                            <Input
                                type="password"
                                placeholder="New Password"
                                {...inputStyles}
                            />
                            <Input
                                type="password"
                                placeholder="Confirm new Password"
                                {...inputStyles}
                            />

                            <button
                                type="button"
                                onClick={() => setInternalStep("reset-success")}
                                style={primaryBtnStyle}
                            >
                                Confirm
                            </button>
                        </Flex>
                    </>
                )}

                {/* ─── Step 4: Success ─── */}
                {internalStep === "reset-success" && (
                    <>
                        <Box textAlign="center" mb="8">
                            <Flex justify="center" mb="6">
                                <Flex
                                    w="80px"
                                    h="80px"
                                    bg="green.50"
                                    borderRadius="full"
                                    align="center"
                                    justify="center"
                                >
                                    <Icon as={CheckCircle} boxSize="10" color="#2ecc71" />
                                </Flex>
                            </Flex>
                            <Heading size="md" fontWeight="900" color="gray.800" mb="3">
                                Password Reset successfully
                            </Heading>
                            <Text fontSize="12px" fontWeight="500" color="gray.400">
                                Your password has been updated successfully
                            </Text>
                        </Box>

                        <button
                            type="button"
                            onClick={onBackToLogin}
                            style={primaryBtnStyle}
                        >
                            Continue
                        </button>
                    </>
                )}
            </AuthCard>
        </Flex>
    );
};

export default ForgotPasswordFlow;
