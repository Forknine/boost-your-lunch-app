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

const byrTheme = {
  bg: '#F7F7F4',
  surface: '#FFFFFF',
  text: '#1E1E1B',
  muted: '#676767',
  border: '#E7E7E2',
  brand: '#0F0F10',
  highlight: '#8CC63E'
};

function Screen({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.pageHeader}>
          <Text style={styles.kicker}>Boost Your Lunch</Text>
          <Text style={styles.screenTitle}>{title}</Text>
          {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function Panel({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: string }) {
  return (
    <View style={styles.panel}>
      <View style={styles.panelTopRow}>
        <Text style={styles.panelTitle}>{title}</Text>
        {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      </View>
      {subtitle ? <Text style={styles.panelSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function HomeScreen({ navigation }: any) {
  const quickActions = ['Order Lunch', 'Upcoming Orders', 'Past Orders', 'My Family', 'Support'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Serving students everywhere</Text>
          <Text style={styles.heroTitle}>Boost Your Lunch</Text>
          <Text style={styles.heroSubtitle}>School lunches. Handled.</Text>
        </View>

        <Panel
          title="Announcement"
          subtitle="Milk ordering for April is open. Place or update orders before tonight at 8:00 PM."
          badge="NEW"
        />

        <View style={styles.twoColumn}>
          <Panel title="Next Lunch" subtitle="Thu, Apr 16" />
          <Panel title="Upcoming" subtitle="6 active orders" />
        </View>

        <Text style={styles.sectionLabel}>Quick Actions</Text>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action}
            style={styles.primaryAction}
            onPress={() => {
              if (action === 'Upcoming Orders') navigation.navigate('Upcoming');
              if (action === 'My Family') navigation.navigate('Family');
              if (action === 'Support') navigation.navigate('Support');
              if (action === 'Past Orders') navigation.navigate('Past');
              if (action === 'Order Lunch') navigation.navigate('Order');
            }}
          >
            <Text style={styles.primaryActionText}>{action}</Text>
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
    'Select available dates',
    'Choose items',
    'Review & validate',
    'Checkout in Shopify'
  ];

  return (
    <Screen title="Order Lunch" subtitle="Schedule first, checkout second.">
      {steps.map((step, index) => (
        <Panel key={step} title={`${index + 1}. ${step}`} />
      ))}
    </Screen>
  );
}

function UpcomingOrdersScreen({ navigation }: any) {
  const rows = [
    { child: 'Mia Johnson', date: 'Apr 16', item: 'Chicken Teriyaki', status: 'Editable until 6:00 PM' },
    { child: 'Leo Johnson', date: 'Apr 17', item: 'Mac & Cheese', status: 'Locked after cutoff' }
  ];

  return (
    <Screen title="Upcoming Orders" subtitle="List and calendar are powered by one order model.">
      {rows.map((row) => (
        <TouchableOpacity key={`${row.child}-${row.date}`} style={styles.panel} onPress={() => navigation.getParent()?.navigate('OrderDetail')}>
          <View style={styles.panelTopRow}>
            <Text style={styles.panelTitle}>{row.child}</Text>
            <Text style={styles.datePill}>{row.date}</Text>
          </View>
          <Text style={styles.panelSubtitle}>{row.item}</Text>
          <Text style={styles.metaStatus}>{row.status}</Text>
        </TouchableOpacity>
      ))}
    </Screen>
  );
}

function PastOrdersScreen() {
  return (
    <Screen title="Past Orders" subtitle="Completed and cancelled history.">
      <Panel title="Mia • Apr 2" subtitle="Turkey Sandwich" badge="Completed" />
      <Panel title="Leo • Apr 1" subtitle="Pizza Slice" badge="Cancelled" />
    </Screen>
  );
}

function FamilyScreen({ navigation }: any) {
  return (
    <Screen title="My Family" subtitle="Children, school assignments, and notes.">
      <TouchableOpacity style={styles.panel} onPress={() => navigation.getParent()?.navigate('ChildDetail')}>
        <Text style={styles.panelTitle}>Mia Johnson</Text>
        <Text style={styles.panelSubtitle}>Maple Elementary • Ms. Rivera • Grade 4</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panel} onPress={() => navigation.getParent()?.navigate('ChildDetail')}>
        <Text style={styles.panelTitle}>Leo Johnson</Text>
        <Text style={styles.panelSubtitle}>Maple Elementary • Mr. Singh • Grade 2</Text>
      </TouchableOpacity>
    </Screen>
  );
}

function SupportScreen() {
  return (
    <Screen title="Support" subtitle="Submit requests and track replies.">
      <Panel title="New Request" subtitle="Order help, cancellation/refund, app issue, or general." />
      <Panel title="Open Thread" subtitle="Lunch change after cutoff • 1 unread reply" badge="Unread" />
    </Screen>
  );
}

function NotificationsScreen() {
  return (
    <Screen title="Notifications" subtitle="In-app message log for all push events.">
      <Panel title="Order Confirmed" subtitle="2 lunches confirmed for Mia • 9:04 AM" />
      <Panel title="Reminder" subtitle="Ordering closes tonight • 3:00 PM" />
      <Panel title="Support Reply" subtitle="Your request has a new response • 4:12 PM" />
    </Screen>
  );
}

function SettingsScreen() {
  return (
    <Screen title="Settings" subtitle="Account and app preferences.">
      <Panel title="Notification Preferences" subtitle="Morning reminders: On" />
      <Panel title="Linked Account" subtitle="Shopify customer connected" />
      <Panel title="App Version" subtitle="0.1.0" />
    </Screen>
  );
}

function OrderDetailScreen() {
  return (
    <Screen title="Order Detail" subtitle="Eligibility logic should be backend-driven.">
      <Panel title="Child" subtitle="Mia Johnson" />
      <Panel title="Date" subtitle="Thu, Apr 16" />
      <Panel title="Item" subtitle="Chicken Teriyaki" />
      <Panel title="Status" subtitle="Upcoming • Can modify until 6:00 PM" badge="Editable" />
    </Screen>
  );
}

function ChildDetailScreen() {
  return (
    <Screen title="Child Detail" subtitle="Manage profile, school, class, and notes.">
      <Panel title="Name" subtitle="Mia Johnson" />
      <Panel title="School/Class" subtitle="Maple Elementary • Ms. Rivera" />
      <Panel title="Dietary Notes" subtitle="Nut allergy" />
      <Panel title="Status" subtitle="Active" />
    </Screen>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: byrTheme.surface,
          borderTopColor: byrTheme.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarActiveTintColor: byrTheme.brand,
        tabBarInactiveTintColor: '#8C8C8C'
      }}
    >
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
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: byrTheme.surface },
          headerTintColor: byrTheme.text,
          headerTitleStyle: { fontWeight: '700' }
        }}
      >
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
    backgroundColor: byrTheme.bg
  },
  container: {
    padding: 16,
    gap: 12
  },
  hero: {
    backgroundColor: byrTheme.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: byrTheme.border,
    padding: 16
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: byrTheme.text,
    letterSpacing: -0.4
  },
  heroSubtitle: {
    marginTop: 4,
    color: byrTheme.muted,
    fontSize: 16
  },
  kicker: {
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
    color: byrTheme.muted,
    marginBottom: 4
  },
  pageHeader: {
    marginBottom: 4
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: byrTheme.text,
    letterSpacing: -0.4
  },
  screenSubtitle: {
    marginTop: 4,
    color: byrTheme.muted,
    fontSize: 14
  },
  sectionLabel: {
    marginTop: 6,
    marginBottom: 2,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: byrTheme.muted,
    fontWeight: '700'
  },
  primaryAction: {
    borderRadius: 999,
    backgroundColor: byrTheme.brand,
    paddingVertical: 15,
    paddingHorizontal: 16
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  twoColumn: {
    gap: 12
  },
  panel: {
    backgroundColor: byrTheme.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: byrTheme.border,
    padding: 14
  },
  panelTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  panelTitle: {
    color: byrTheme.text,
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1
  },
  panelSubtitle: {
    color: byrTheme.muted,
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20
  },
  badge: {
    backgroundColor: '#EFF8E1',
    color: '#4F7F19',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden'
  },
  datePill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: byrTheme.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    color: byrTheme.text,
    fontWeight: '600'
  },
  metaStatus: {
    marginTop: 10,
    color: byrTheme.highlight,
    fontWeight: '700',
    fontSize: 13
  }
});
