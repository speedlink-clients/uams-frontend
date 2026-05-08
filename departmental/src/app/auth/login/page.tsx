import { useNavigate } from "react-router";
import useAuthStore from "@stores/auth.store";
import { AuthHooks } from "@hooks/auth.hook";
import useLoginForm from "@forms/auth/login.form"; 
import { PasswordInput } from "@components/ui/password-input";
import {
  Box,
  Flex,
  Text,
  Image,
  Spinner,
  Input,
  Field,
  Stack,
  Button,
} from "@chakra-ui/react";
import type { LoginFormData } from "@schemas/auth/login.schema";

const LoginPage = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();

  const { mutate: login, isPending: isLoading } = AuthHooks.useLogin({
    onSuccess: (data) => {
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
  });

  const onSubmit = (formData: LoginFormData) => {
    login(formData);
  };

  return (
    <Flex minH="100vh" w="full" bg="white" fontFamily="'Inter'">
      {/* Left Side - Campus Image */}
      <Box display={{ base: "none", lg: "block" }} w="65%" position="relative">
        <Image
          src="/departmental-admin/assets/slider.jpeg"
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
          boxShadow="2xl"
        >
          {/* Logo */}
          <Flex justifyContent="center" mb="12">
            <Image
              src="/departmental-admin/assets/uphcscLG.png"
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

          <Stack direction="column" asChild gap="6" colorPalette="accent.500">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Field.Root invalid={!!errors.email}>
                <Field.Label display="none">Email</Field.Label>
                <Input
                  placeholder="Enter Email"
                  {...register("email")}
                  disabled={isLoading}
                  bg="white"
                   _focus={{
                  borderColor: "accent.500"
                  }}
                />
                <Field.ErrorText width="full">
                  {errors.email?.message}
                </Field.ErrorText>
              </Field.Root>

              {/* Password Field */}
              <Field.Root invalid={!!errors.password}>
                <Field.Label display="none">Password</Field.Label>
                <PasswordInput
                  placeholder="Enter Password"
                  {...register("password")}
                  disabled={isLoading}
                  bg="white"
                   _focus={{
                  borderColor: "accent.500"
                  }}
                />
                <Field.ErrorText width="full">
                  {errors.password?.message}
                </Field.ErrorText>
              </Field.Root>

              {/* Submit Button */}
              <Button
                type="submit"
                width="full"
                bg="accent.500"
                size="xl"
                color="white"
                py="5"
                fontSize="16px"
                fontWeight="black"
                boxShadow="xl"
                transition="all 0.2s"
                mt="6"
                border="none"
                cursor={isLoading ? "not-allowed" : "pointer"}
                alignItems="center"
                justifyContent="center"
                _hover={{ bg: "#1565c0" }}
                opacity={isLoading ? 0.7 : 1}
                _active={{ transform: "scale(0.98)" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" mr="3" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Stack>

          {/* Forgot Password */}
          <Box mt="10" textAlign="center">
            <Text fontSize="13px" fontWeight="bold" color="gray.400">
              Forgot Password?{" "}
              <Text
                as="span"
                color="#3b82f6"
                _hover={{ color: "#1d76d2", textDecoration: "underline" }}
                transition="all 0.2s"
                onClick={() => !isLoading && navigate("/forgot-password")}
                cursor={isLoading ? "not-allowed" : "pointer"}
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