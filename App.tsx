import React, { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { announcement, children, scheduledOrders, supportThreads } from './src/mockData';
import { ScheduledOrderItem } from './src/models';

type RootStackParamList = {
  Main: undefined;
  OrderDetail: { orderId: string };
  ChildDetail: { childId: string };
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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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
  const upcoming = scheduledOrders.filter((order) => ['Editable', 'Locked', 'Confirmed'].includes(order.status));
  const nextOrder = [...upcoming].sort((a, b) => a.serviceDate.localeCompare(b.serviceDate))[0];

  const quickActions = ['Order Lunch', 'Upcoming Orders', 'Past Orders', 'My Family', 'Support'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Serving students everywhere</Text>
          <Text style={styles.heroTitle}>Boost Your Lunch</Text>
          <Text style={styles.heroSubtitle}>School lunches. Handled.</Text>
        </View>

        <Panel title={announcement.title} subtitle={announcement.body} badge={announcement.ctaLabel?.toUpperCase()} />

        <View style={styles.twoColumn}>
          <Panel title="Next Lunch" subtitle={nextOrder ? `${formatDate(nextOrder.serviceDate)} • ${nextOrder.childName}` : 'No upcoming lunches'} />
          <Panel title="Upcoming" subtitle={`${upcoming.length} active orders`} />
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
  return (
    <Screen title="Order Lunch" subtitle="Supabase-first scheduling flow, then Shopify checkout.">
      <Panel title="Step 1" subtitle="Select child + school context" />
      <Panel title="Step 2" subtitle="Select program and service dates" />
      <Panel title="Step 3" subtitle="Choose menu items and modifiers" />
      <Panel title="Step 4" subtitle="Validate cutoffs and availability" />
      <Panel title="Step 5" subtitle="Checkout and payment via Shopify" />
    </Screen>
  );
}

function UpcomingOrdersScreen({ navigation }: any) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Editable' | 'Locked'>('All');

  const orders = scheduledOrders.filter((order) => ['Editable', 'Locked', 'Confirmed'].includes(order.status));
  const filteredOrders = orders.filter((order) => (statusFilter === 'All' ? true : order.status === statusFilter));

  const groupedByDate = useMemo(() => {
    return filteredOrders.reduce<Record<string, ScheduledOrderItem[]>>((acc, item) => {
      if (!acc[item.serviceDate]) acc[item.serviceDate] = [];
      acc[item.serviceDate].push(item);
      return acc;
    }, {});
  }, [filteredOrders]);

  return (
    <Screen title="Upcoming Orders" subtitle="Toggle between list and calendar presentation.">
      <View style={styles.toggleRow}>
        {(['list', 'calendar'] as const).map((mode) => (
          <TouchableOpacity key={mode} style={[styles.toggleButton, viewMode === mode && styles.toggleButtonActive]} onPress={() => setViewMode(mode)}>
            <Text style={[styles.toggleButtonText, viewMode === mode && styles.toggleButtonTextActive]}>{mode === 'list' ? 'List View' : 'Calendar View'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.toggleRow}>
        {(['All', 'Editable', 'Locked'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, statusFilter === status && styles.filterChipActive]}
            onPress={() => setStatusFilter(status)}
          >
            <Text style={[styles.filterChipText, statusFilter === status && styles.filterChipTextActive]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {viewMode === 'list' &&
        filteredOrders.map((row) => (
          <TouchableOpacity key={row.id} style={styles.panel} onPress={() => navigation.getParent()?.navigate('OrderDetail', { orderId: row.id })}>
            <View style={styles.panelTopRow}>
              <Text style={styles.panelTitle}>{row.childName}</Text>
              <Text style={styles.datePill}>{formatDate(row.serviceDate)}</Text>
            </View>
            <Text style={styles.panelSubtitle}>{`${row.program} • ${row.menuItem}`}</Text>
            <Text style={styles.metaStatus}>{row.status}</Text>
          </TouchableOpacity>
        ))}

      {viewMode === 'calendar' &&
        Object.entries(groupedByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, rows]) => (
            <View key={date} style={styles.panel}>
              <Text style={styles.panelTitle}>{formatDate(date)}</Text>
              {rows.map((row) => (
                <TouchableOpacity key={row.id} style={styles.calendarLine} onPress={() => navigation.getParent()?.navigate('OrderDetail', { orderId: row.id })}>
                  <Text style={styles.calendarLineText}>{`${row.childName} • ${row.menuItem}`}</Text>
                  <Text style={styles.calendarLineMeta}>{row.status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
    </Screen>
  );
}

function PastOrdersScreen() {
  const past = scheduledOrders.filter((order) => ['Fulfilled', 'Cancelled', 'Refunded'].includes(order.status));

  return (
    <Screen title="Past Orders" subtitle="Completed and cancelled history.">
      {past.map((order) => (
        <Panel
          key={order.id}
          title={`${order.childName} • ${formatDate(order.serviceDate)}`}
          subtitle={`${order.program} • ${order.menuItem}`}
          badge={order.status}
        />
      ))}
    </Screen>
  );
}

function FamilyScreen({ navigation }: any) {
  return (
    <Screen title="My Family" subtitle="Children, school assignments, and notes.">
      {children.map((child) => (
        <TouchableOpacity key={child.id} style={styles.panel} onPress={() => navigation.getParent()?.navigate('ChildDetail', { childId: child.id })}>
          <Text style={styles.panelTitle}>{`${child.firstName} ${child.lastName ?? ''}`.trim()}</Text>
          <Text style={styles.panelSubtitle}>{`${child.school} • ${child.classroom} • Grade ${child.grade}`}</Text>
        </TouchableOpacity>
      ))}
      <Panel title="Add Child" subtitle="MVP: connect to child create form in next iteration" />
    </Screen>
  );
}

function SupportScreen() {
  return (
    <Screen title="Support" subtitle="Submit requests and track replies.">
      <Panel title="Create New Request" subtitle="Order Help, Cancellation/Refund, School Question, App Issue, General" />
      {supportThreads.map((thread) => (
        <Panel
          key={thread.id}
          title={thread.subject}
          subtitle={`${thread.category} • Updated ${thread.updatedAt}`}
          badge={thread.unread ? 'Unread' : 'Open'}
        />
      ))}
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
  const [morningReminder, setMorningReminder] = useState(true);
  const [deadlineReminder, setDeadlineReminder] = useState(true);

  return (
    <Screen title="Settings" subtitle="Account, notifications, and preferences.">
      <View style={styles.settingsRow}>
        <View>
          <Text style={styles.panelTitle}>Morning-of reminder</Text>
          <Text style={styles.panelSubtitle}>Send a notification on lunch days</Text>
        </View>
        <Switch value={morningReminder} onValueChange={setMorningReminder} trackColor={{ true: '#BFE48A' }} thumbColor={morningReminder ? '#4F7F19' : '#C5C5C5'} />
      </View>
      <View style={styles.settingsRow}>
        <View>
          <Text style={styles.panelTitle}>Ordering deadline reminder</Text>
          <Text style={styles.panelSubtitle}>Notify before nightly cutoff time</Text>
        </View>
        <Switch value={deadlineReminder} onValueChange={setDeadlineReminder} trackColor={{ true: '#BFE48A' }} thumbColor={deadlineReminder ? '#4F7F19' : '#C5C5C5'} />
      </View>
      <Panel title="Linked Account" subtitle="Shopify customer connected" />
      <Panel title="App Version" subtitle="0.2.0" />
    </Screen>
  );
}

function OrderDetailScreen({ route }: any) {
  const order = scheduledOrders.find((item) => item.id === route.params.orderId);

  if (!order) {
    return (
      <Screen title="Order Detail" subtitle="Order not found.">
        <Panel title="Missing order" subtitle="Please go back and select another order." />
      </Screen>
    );
  }

  return (
    <Screen title="Order Detail" subtitle="Backend eligibility controls modify/cancel actions.">
      <Panel title="Child" subtitle={order.childName} />
      <Panel title="Service Date" subtitle={formatDate(order.serviceDate)} />
      <Panel title="Program" subtitle={order.program} />
      <Panel title="Item" subtitle={order.menuItem} />
      <Panel title="Status" subtitle={order.status} badge={order.status === 'Editable' ? 'Can Modify' : 'Locked'} />
      <Panel title="Shopify Reference" subtitle={order.shopifyOrderRef ?? 'Pending'} />
    </Screen>
  );
}

function ChildDetailScreen({ route }: any) {
  const child = children.find((item) => item.id === route.params.childId);

  if (!child) {
    return (
      <Screen title="Child Detail" subtitle="Child not found.">
        <Panel title="Missing child profile" subtitle="Please return to My Family and try again." />
      </Screen>
    );
  }

  return (
    <Screen title="Child Detail" subtitle="Manage profile, school, class, and notes.">
      <Panel title="Name" subtitle={`${child.firstName} ${child.lastName ?? ''}`.trim()} />
      <Panel title="School/Class" subtitle={`${child.school} • ${child.classroom}`} />
      <Panel title="Grade" subtitle={child.grade} />
      <Panel title="Notes" subtitle={child.notes ?? 'No notes'} />
      <Panel title="Status" subtitle={child.active ? 'Active' : 'Inactive'} />
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
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8
  },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: byrTheme.border,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: byrTheme.surface
  },
  toggleButtonActive: {
    backgroundColor: byrTheme.brand,
    borderColor: byrTheme.brand
  },
  toggleButtonText: {
    color: byrTheme.text,
    fontWeight: '600'
  },
  toggleButtonTextActive: {
    color: '#FFFFFF'
  },
  filterChip: {
    borderWidth: 1,
    borderColor: byrTheme.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: byrTheme.surface
  },
  filterChipActive: {
    borderColor: byrTheme.highlight,
    backgroundColor: '#F3FADF'
  },
  filterChipText: {
    color: byrTheme.text,
    fontSize: 13,
    fontWeight: '600'
  },
  filterChipTextActive: {
    color: '#416A14'
  },
  calendarLine: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: byrTheme.border
  },
  calendarLineText: {
    color: byrTheme.text,
    fontWeight: '600'
  },
  calendarLineMeta: {
    marginTop: 3,
    color: byrTheme.muted,
    fontSize: 13
  },
  settingsRow: {
    backgroundColor: byrTheme.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: byrTheme.border,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  }
});
