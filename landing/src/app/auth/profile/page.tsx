import React, { useState } from 'react';
import { HiOutlineUser } from 'react-icons/hi';
import { Box, Flex, Text, Button, Stack, Heading, Input, Field } from "@chakra-ui/react";
import { useVerifyStudent } from '@hooks/auth.hook';
import useAuthStore from '@stores/auth.store';

import { type RegNumberStepProps } from '@type/auth.type';

const RegNumberStep: React.FC<RegNumberStepProps> = ({ onNext }) => {
  const { setAuth } = useAuthStore();
  const [matricNumber, setMatricNumber] = useState('');

  const { mutate: verifyStudent, isPending: isLoading } = useVerifyStudent({
    onSuccess: (response) => {
      setAuth({
        token: response.data.verificationToken,
        user: {
          name: `${response.data.profile.firstName} ${response.data.profile.lastName}`,
          email: "", // Will be set in next step
          role: "STUDENT",
          profile: response.data.profile,
        },
        expireAt: "15m",
      });
      onNext();
    }
  });

  const handleVerify = () => {
    if (!matricNumber.trim()) return;
    verifyStudent(matricNumber);
  };

  return (
    <Flex 
      minH="100vh" 
      w="full" 
      fontFamily="'Inter'"
      bgImage={"url(/images/slider.jpeg)"}
      bgSize={"cover"}
      bgPos={"center"}
      bgRepeat={"no-repeat"}
      py="10"
      justify={"center"}
      align={"center"}
    >
      <Box
        w={{ base: "full", lg: "450px" }}
        bg="white"
        p={{ base: "8", md: "12" }}
        rounded="3xl"
        boxShadow="2xl"
        mx="4"
      >
        <Stack gap="10">
          <Box textAlign="center">
            <Heading size="2xl" fontWeight="black" color="fg.emphasized" mb="3">
              Verify Student
            </Heading>
            <Text fontSize="14px" fontWeight="medium" color="fg.subtle">
              Welcome! Please input your matriculation or reg. number to verify your account
            </Text>
          </Box>
          
          <Stack gap="6">
            <Field.Root>
              <Box position="relative">
                <Input
                  placeholder="Enter Matriculation or Reg. Number"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  size="xl"
                  rounded="xl"
                  pr="12"
                  _focus={{ ring: "4", ringColor: "blue.100/50", borderColor: "blue.500" }}
                />
                <Box 
                  position="absolute" 
                  right="4" 
                  top="50%" 
                  transform="translateY(-50%)" 
                  color="gray.400"
                  pointerEvents="none"
                >
                  <HiOutlineUser size={20} />
                </Box>
              </Box>
            </Field.Root>

            <Button
              onClick={handleVerify}
              loading={isLoading}
              disabled={isLoading || !matricNumber.trim()}
              size="xl"
              w="full"
              colorPalette="blue"
              rounded="xl"
              fontWeight="black"
              boxShadow="lg"
            >
              Verify
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  );
};

export default RegNumberStep;
