import { useContext, useState } from 'react';
import {
  Box,
  FormControl,
  Input,
  Button,
  Heading,
  Center,
  chakra,
  InputGroup,
  InputLeftElement,
  Stack,
  Flex,
} from '@chakra-ui/react';

import { FaUserAlt, FaLock } from 'react-icons/fa';
import { AuthContext } from '../context/AuthWrapper.jsx';
import house from '../assets/home.png';

// Chakra Icon Componentlari
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const { loginUser } = useContext(AuthContext);

  const initialFormData = {
    username: '',
    password: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(formData); // ← formData uzatilmoqda
  };

  return (
    <Center h="100vh">
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Flex>
          <Box color="gray.800">
            <Box maxW="35px" mb="-10px">
              <img src={house} alt="logo" />
            </Box>
            <Heading fontSize="50px">InveSTORE</Heading>
          </Box>
        </Flex>

        <Box
          minW={{ base: '90%', md: '468px' }}
          color="black"
          bg="whiteAlpha.900"
          p={8}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
        >
          <Box my={1} textAlign="left">
            <form onSubmit={handleSubmit}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <CFaUserAlt color="gray.400" />
                  </InputLeftElement>
                  <Input
                    borderColor="gray.400"
                    color="black"
                    placeholder="username"
                    name="username"
                    onChange={handleChange}
                    sx={{ '::placeholder': { color: 'gray.400' } }}
                    _hover={{
                      borderColor: 'gray.500',
                      color: 'black',
                      cursor: 'pointer',
                    }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl mt={6}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <CFaLock color="gray.400" />
                  </InputLeftElement>
                  <Input
                    borderColor="gray.400"
                    type="password"
                    placeholder="password"
                    name="password"
                    onChange={handleChange}
                    sx={{ '::placeholder': { color: 'gray.400' } }}
                    _hover={{
                      borderColor: 'gray.500',
                      color: 'black',
                      cursor: 'pointer',
                    }}
                  />
                </InputGroup>
              </FormControl>

              <Button
                width="full"
                bg="green.500"
                variant="solid"
                mt={4}
                type="submit"
                color="white"
                _hover={{
                  backgroundColor: 'green.600',
                  cursor: 'pointer',
                }}
              >
                Kirish
              </Button>
            </form>
          </Box>
        </Box>
      </Stack>
    </Center>
  );
};

export default Login;
