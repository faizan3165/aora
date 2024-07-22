import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

import { images } from "../../constants";
import { createUser } from "../../scripts/users";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const passwordInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLoggedIn(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Image
            source={images.logo}
            resizeMethod="contain"
            className="w-[116px] h-[35px]"
          />

          <Text className="text-2xl text-white text-semibold font-psemibold mt-10">
            Sign Up to Aora
          </Text>

          <FormField
            title={"Username"}
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={"mt-10"}
            onSubmitEditing={() => emailInputRef.current.focus()}
          />

          <FormField
            title={"Email"}
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={"mt-7"}
            keyboardType="email-address"
            onSubmitEditing={() => passwordInputRef.current.focus()}
            ref={emailInputRef}
          />

          <FormField
            title={"Password"}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={"mt-7"}
            isLastField={true}
            ref={passwordInputRef}
            onSubmitEditing={submit}
          />

          <CustomButton
            title={"Sign Up"}
            handlePress={submit}
            containerStyles={"mt-7"}
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already Have An Account?
            </Text>

            <Link
              href={"/signin"}
              className="text-lg font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
