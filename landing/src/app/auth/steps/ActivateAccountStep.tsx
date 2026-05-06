import React from 'react';
import { useActivateAccount } from "@hooks/auth.hook";
import { useActivateAccountForm } from "@forms/auth.form";
import { PasswordInput } from "@components/ui/password-input";
import { Box, Flex, Text, Image, Input, Field, Button, Stack, Heading, SimpleGrid, Separator, Card } from "@chakra-ui/react";
import useAuthStore from '@stores/auth.store';
import { type ActivateAccountStepProps, type ActivateAccountFormData } from '@type/auth.type';
import AuthBackground from '../components/AuthBackground';

const ActivateAccountStep: React.FC<ActivateAccountStepProps> = ({ onNext }) => {
    const { user: studentInfo } = useAuthStore();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useActivateAccountForm();

    React.useEffect(() => {
        if (studentInfo?.email) {
            setValue("email", studentInfo.email);
        }
    }, [studentInfo, setValue]);

    const { mutate: activate, isPending: isLoading } = useActivateAccount({
        onSuccess: () => {
            onNext();
        },
    });

    const onSubmit = (formData: ActivateAccountFormData) => {
        activate(formData);
    };

    // Helper to split full name
    const getNames = (fullName: string) => {
        const parts = fullName ? fullName.split(' ') : [];
        if (parts.length === 0) return { firstName: '', otherName: '' };
        return {
            firstName: parts[0],
            otherName: parts.slice(1).join(' ')
        };
    };

    const { firstName, otherName } = getNames(studentInfo?.name || '');

    const InfoItem = ({ label, value }: { label: string; value: string }) => (
        <Stack gap="1">
            <Text fontSize="xs" fontWeight="bold" color="fg.subtle" textTransform="uppercase" letterSpacing="wider">
                {label}
            </Text>
            <Box bg="gray.50" p="3" rounded="md" border="1px solid" borderColor="gray.100">
                <Text fontSize="sm" fontWeight="semibold" color="fg.muted">
                    {value || 'N/A'}
                </Text>
            </Box>
        </Stack>
    );

    return (
        <Flex minH="100vh" w="full" bg="white" fontFamily="'Inter'"
            bgImage={"url(/images/slider.jpeg)"}
            bgSize={"cover"}
            bgPos={"center"}
            bgRepeat={"no-repeat"}
            py="20"
            justify={"center"}
            align={"center"}
        >
            <AuthBackground />
            
            <Card.Root 
                variant="elevated" 
                w="full" 
                maxW="4xl" 
                rounded="3xl" 
                overflow="hidden" 
                mx="4"
                boxShadow="2xl"
                bg="white/95"
                backdropBlur="md"
            >
                <Card.Body p={{ base: "8", md: "12" }}>
                    <Stack gap="10">
                        {/* Header */}
                        <Flex direction="column" align="center" gap="4">
                            <Image
                                src="/public/images/uphcscLG.png"
                                alt="Logo"
                                h="16"
                                objectFit="contain"
                            />
                            <Box textAlign="center">
                                <Heading size="2xl" fontWeight="black" color="accent">
                                    Account Activation
                                </Heading>
                                <Text color="fg.subtle" fontSize="sm">
                                    Please verify your information and set up your account credentials
                                </Text>
                            </Box>
                        </Flex>

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap="12">
                            {/* Student Info Section */}
                            <Stack gap="6">
                                <Heading size="md" color="accent" fontWeight="bold">
                                    Student Information
                                </Heading>
                                <SimpleGrid columns={2} gap="4">
                                    <InfoItem label="Reg No." value={studentInfo?.profile?.registrationNo} />
                                    <InfoItem label="Mat No." value={studentInfo?.profile?.matricNumber} />
                                    <InfoItem label="First Name" value={firstName} />
                                    <InfoItem label="Other Name" value={otherName} />
                                    <InfoItem label="Sex" value={studentInfo?.profile?.gender || studentInfo?.sex} />
                                    <InfoItem label="Entry Mode" value={studentInfo?.profile?.admissionMode || studentInfo?.admissionMode || 'UTME'} />
                                    <InfoItem label="Course" value="COMPUTER SCIENCE" />
                                    <InfoItem label="Level" value="100" />
                                </SimpleGrid>
                            </Stack>

                            {/* Form Section */}
                            <Stack gap="6">
                                <Heading size="md" color="accent" fontWeight="bold">
                                    Account Setup
                                </Heading>
                                
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack gap="5">
                                        <Field.Root invalid={!!errors.email}>
                                            <Field.Label>Email Address</Field.Label>
                                            <Input
                                                type="email"
                                                placeholder="Enter Email"
                                                {...register("email")}
                                                disabled={isLoading}
                                                size="lg"
                                            />
                                            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.phone}>
                                            <Field.Label>Phone Number</Field.Label>
                                            <Input
                                                type="tel"
                                                placeholder="Enter Phone Number"
                                                {...register("phone")}
                                                disabled={isLoading}
                                                size="lg"
                                            />
                                            <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.password}>
                                            <Field.Label>Password</Field.Label>
                                            <PasswordInput
                                                placeholder="Create Password"
                                                {...register("password")}
                                                disabled={isLoading}
                                                size="lg"
                                            />
                                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.confirmPassword}>
                                            <Field.Label>Confirm Password</Field.Label>
                                            <PasswordInput
                                                placeholder="Confirm Password"
                                                {...register("confirmPassword")}
                                                disabled={isLoading}
                                                size="lg"
                                            />
                                            <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
                                        </Field.Root>

                                        <Button
                                            type="submit"
                                            size="xl"
                                            w="full"
                                            loading={isLoading}
                                            loadingText="Activating..."
                                            disabled={isLoading}
                                            mt="4"
                                        >
                                            Activate My Account
                                        </Button>
                                    </Stack>
                                </form>
                            </Stack>
                        </SimpleGrid>

                        <Separator />

                        <Text color="fg.subtle" textAlign="center" fontSize="sm">
                            Need help? Contact support or verify another registration number.
                        </Text>
                    </Stack>
                </Card.Body>
            </Card.Root>
        </Flex>
    );
};

export default ActivateAccountStep;
