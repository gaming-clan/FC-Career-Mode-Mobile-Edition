import { Stack } from "expo-router";

export default function ModesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="manager" />
      <Stack.Screen name="player" />
      <Stack.Screen name="sporting_director" />
      <Stack.Screen name="create_a_club" />
      <Stack.Screen name="squad-management" />
      <Stack.Screen name="fixtures" />
      <Stack.Screen name="standings" />
      <Stack.Screen name="financial" />
      <Stack.Screen name="transfers" />
      <Stack.Screen name="match-report" />
      <Stack.Screen name="career-saves" />
      <Stack.Screen name="board-expectations" />
    </Stack>
  );
}
