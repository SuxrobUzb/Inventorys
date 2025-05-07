import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Textarea,
  VStack,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../services/apiClient';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FaPlus, FaTrash } from 'react-icons/fa';

const UpdateItem = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    product_name: '',
    price: '0.00',
    description: '',
    inventory_numbers: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosInstance.get(`inventory/product/${id}/`);
        setValues({
          product_name: response.data.product_name,
          price: response.data.price,
          description: response.data.description,
          inventory_numbers: response.data.inventory_numbers.map(
            (inv) => inv.inventory_number
          ),
        });
      } catch (error) {
        enqueueSnackbar('Update: Error occurred while fetching data', {
          variant: 'error',
          autoHideDuration: 5000,
        });
        console.error('Error occurred:', error);
      }
    };
    const cancelToken = axios.CancelToken.source();
    getData();
    return () => {
      cancelToken.cancel();
    };
  }, [id]);

  const handleAddInventoryNumber = () => {
    setValues({
      ...values,
      inventory_numbers: [...values.inventory_numbers, ''],
    });
  };

  const handleInventoryNumberChange = (index, value) => {
    const updatedNumbers = [...values.inventory_numbers];
    updatedNumbers[index] = value;
    setValues({ ...values, inventory_numbers: updatedNumbers });
  };

  const handleRemoveInventoryNumber = (index) => {
    const updatedNumbers = values.inventory_numbers.filter((_, i) => i !== index);
    setValues({ ...values, inventory_numbers: updatedNumbers });
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (values.inventory_numbers.some((num) => !num.trim())) {
      enqueueSnackbar('All inventory numbers must be filled!', { variant: 'error' });
      return;
    }

    try {
      await axiosInstance.put(`inventory/product/${id}/`, {
        product_name: values.product_name,
        price: values.price,
        description: values.description,
        inventory_numbers: values.inventory_numbers,
      });
      enqueueSnackbar('Item Updated!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Update: Something went wrong!', { variant: 'error' });
      console.error('Update error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Box p="20px" mx="auto">
      <Box bg="whiteAlpha.700" maxW="100%" borderRadius={5}>
        <Box maxW="xl" bg="whiteAlpha.500" p="10px" borderRadius={5}>
          <form onSubmit={handleEdit}>
            <Text fontSize="30px" as="b" padding={10}>
              Edit Item
            </Text>
            <VStack p={10} spacing={8}>
              <FormControl id="product_name" isRequired>
                <FormLabel fontSize="18px">Product Name</FormLabel>
                <Input
                  borderColor="gray.400"
                  type="text"
                  value={values.product_name}
                  name="product_name"
                  size="lg"
                  onChange={(e) =>
                    setValues({ ...values, product_name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="price" isRequired>
                <FormLabel fontSize="18px">Price</FormLabel>
                <NumberInput
                  borderColor="gray.400"
                  value={values.price}
                  onChange={(value) => setValues({ ...values, price: value })}
                  min={0}
                  step={0.01}
                  precision={2}
                  size="lg"
                  name="price"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl id="inventory_numbers" isRequired>
                <FormLabel fontSize="18px">Inventory Numbers</FormLabel>
                {values.inventory_numbers.map((number, index) => (
                  <Flex key={index} mb={2} alignItems="center">
                    <Input
                      borderColor="gray.400"
                      value={number}
                      onChange={(e) =>
                        handleInventoryNumberChange(index, e.target.value)
                      }
                      placeholder={`Inventory Number ${index + 1}`}
                      mr={2}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      onClick={() => handleRemoveInventoryNumber(index)}
                    />
                  </Flex>
                ))}
                <Button
                  leftIcon={<FaPlus />}
                  colorScheme="green"
                  onClick={handleAddInventoryNumber}
                  mt={2}
                >
                  Add Inventory Number
                </Button>
              </FormControl>
              <FormControl id="description">
                <FormLabel fontSize="18px">Description</FormLabel>
                <Textarea
                  borderColor="gray.400"
                  name="description"
                  value={values.description}
                  size="lg"
                  onChange={(e) =>
                    setValues({ ...values, description: e.target.value })
                  }
                />
              </FormControl>
              <HStack
                display="flex"
                justifyContent="flex-end"
                width="100%"
                spacing={5}
              >
                <Button size="md" type="submit" colorScheme="green">
                  Save
                </Button>
                <Button
                  size="md"
                  p={3}
                  colorScheme="red"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateItem;