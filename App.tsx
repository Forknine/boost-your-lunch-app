import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type RootStackParamList = {
  Main: undefined;
  OrderDetail: undefined;
  ChildDetail: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const theme = {
  bg: '#F8FAFC',
  card: '#FFFFFF',
  primary: '#0F4C81',
  accent: '#2FA4FF',
  text: '#111827',
  muted: '#6B7280'
};

const quickActions = ['Order Lunch', 'Upcoming Orders', 'Past Orders', 'My Family', 'Support'];

function Card({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>Boost Your Lunch</Text>
        <Card title="Announcement" subtitle="Reminder: ordering closes tonight at 8:00 PM." />
        <View style={styles.summaryRow}>
          <Card title="Next lunch" subtitle="Thu, Apr 9" />
          <Card title="Upcoming" subtitle="6 lunches" />
        </View>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action}
            style={styles.actionButton}
            onPress={() => {
              if (action === 'Upcoming Orders') navigation.navigate('Upcoming');
              if (action === 'My Family') navigation.navigate('Family');
              if (action === 'Support') navigation.navigate('Support');
              if (action === 'Past Orders') navigation.navigate('Past');
              if (action === 'Order Lunch') navigation.navigate('Order');
            }}
          >
            <Text style={styles.actionText}>{action}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function OrderLunchScreen() {
  const steps = [
    'Choose child',
    'Choose program/vendor',
    'Select service dates',
    'Choose items',
    'Review selections',
    'Proceed to checkout'
  ];
  return (
    <Screen title="Order Lunch" subtitle="Scheduling-focused flow (Supabase draft -> Shopify checkout)">
      {steps.map((s, i) => (
        <Card key={s} title={`${i + 1}. ${s}`} />
      ))}
    </Screen>
  );
}

function UpcomingOrdersScreen({ navigation }: any) {
  const rows = [
    { child: 'Mia', date: 'Apr 9', item: 'Chicken Teriyaki', editable: 'Editable until 6:00 PM' },
    { child: 'Leo', date: 'Apr 10', item: 'Mac & Cheese', editable: 'Locked' }
  ];
  return (
    <Screen title="Upcoming Orders" subtitle="List + calendar can render from the same record model">
      {rows.map((r) => (
        <TouchableOpacity key={`${r.child}-${r.date}`} style={styles.card} onPress={() => navigation.getParent()?.navigate('OrderDetail')}>
          <Text style={styles.cardTitle}>{`${r.child} • ${r.date}`}</Text>
          <Text style={styles.cardSubtitle}>{r.item}</Text>
          <Text style={styles.pill}>{r.editable}</Text>
        </TouchableOpacity>
      ))}
    </Screen>
  );
}

function PastOrdersScreen() {
  return (
    <Screen title="Past Orders" subtitle="Completed and cancelled order history">
      <Card title="Apr 2 • Mia" subtitle="Turkey Sandwich • Completed" />
      <Card title="Apr 1 • Leo" subtitle="Pizza Slice • Cancelled" />
    </Screen>
  );
}

function FamilyScreen({ navigation }: any) {
  return (
    <Screen title="My Family" subtitle="Manage child profiles and school/class assignments">
      <TouchableOpacity style={styles.card} onPress={() => navigation.getParent()?.navigate('ChildDetail')}>
        <Text style={styles.cardTitle}>Mia Johnson</Text>
        <Text style={styles.cardSubtitle}>Maple Elementary • Ms. Rivera • Grade 4</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => navigation.getParent()?.navigate('ChildDetail')}>
        <Text style={styles.cardTitle}>Leo Johnson</Text>
        <Text style={styles.cardSubtitle}>Maple Elementary • Mr. Singh • Grade 2</Text>
      </TouchableOpacity>
    </Screen>
  );
}

function SupportScreen() {
  return (
    <Screen title="Support" subtitle="Create requests and review thread replies">
      <Card title="New Request" subtitle="Category: Order help, Cancellation/refund, App issue" />
      <Card title="Open Thread" subtitle="Re: Lunch change after cutoff • Reply from support" />
    </Screen>
  );
}

function NotificationsScreen() {
  return (
    <Screen title="Notifications" subtitle="In-app log for push events">
      <Card title="Order Confirmed" subtitle="2 lunches confirmed for Mia • 9:04 AM" />
      <Card title="Reminder" subtitle="Ordering closes tonight • 3:00 PM" />
      <Card title="Support Reply" subtitle="Your request has a response • 4:12 PM" />
    </Screen>
  );
}

function SettingsScreen() {
  return (
    <Screen title="Settings" subtitle="Preferences and account">
      <Card title="Notification preferences" subtitle="Morning reminders: On" />
      <Card title="Linked account" subtitle="Shopify customer connected" />
      <Card title="App version" subtitle="0.1.0" />
    </Screen>
  );
}

function OrderDetailScreen() {
  return (
    <Screen title="Order Detail" subtitle="Modify/cancel rules enforced by backend eligibility">
      <Card title="Child" subtitle="Mia Johnson" />
      <Card title="Date" subtitle="Thu, Apr 9" />
      <Card title="Item" subtitle="Chicken Teriyaki" />
      <Card title="Status" subtitle="Upcoming • Can modify until 6:00 PM" />
    </Screen>
  );
}

function ChildDetailScreen() {
  return (
    <Screen title="Child Detail" subtitle="Edit child profile">
      <Card title="Name" subtitle="Mia Johnson" />
      <Card title="School/Class" subtitle="Maple Elementary • Ms. Rivera" />
      <Card title="Notes" subtitle="Nut allergy" />
      <Card title="Status" subtitle="Active" />
    </Screen>
  );
}

function Screen({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.screenTitle}>{title}</Text>
        {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Order" component={OrderLunchScreen} options={{ title: 'Order Lunch' }} />
      <Tab.Screen name="Upcoming" component={UpcomingOrdersScreen} />
      <Tab.Screen name="Past" component={PastOrdersScreen} options={{ title: 'Past Orders' }} />
      <Tab.Screen name="Family" component={FamilyScreen} options={{ title: 'My Family' }} />
      <Tab.Screen name="Support" component={SupportScreen} />
      <Tab.Screen name="Alerts" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Order Detail / Modify' }} />
        <Stack.Screen name="ChildDetail" component={ChildDetailScreen} options={{ title: 'Child Detail / Edit' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.bg
  },
  container: {
    padding: 16,
    gap: 12
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.primary,
    marginBottom: 4
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginTop: 8
  },
  actionButton: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  summaryRow: {
    gap: 12
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  cardTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600'
  },
  cardSubtitle: {
    color: theme.muted,
    marginTop: 4,
    fontSize: 14
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text
  },
  screenSubtitle: {
    color: theme.muted,
    fontSize: 14,
    marginBottom: 6
  },
  pill: {
    marginTop: 8,
    alignSelf: 'flex-start',
    color: theme.primary,
    fontWeight: '600'
  }
});
