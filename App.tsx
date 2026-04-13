import React, { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { ScheduledOrderItem } from './src/models';
import { formatDateLabel, getPastOrders, getUpcomingOrders, toUserStatus } from './src/orderLogic';
import { AuthProvider, useAuth } from './src/auth';
import { AppDataProvider, useAppData } from './src/appData';

type RootStackParamList = {
  Main: undefined;
  OrderDetail: { orderId: string };
  ChildDetail: { childId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const byrTheme = {
  bg: '#EDF3FF',
  bgAlt: '#F8FBFF',
  surface: '#FFFFFF',
  text: '#10182E',
  muted: '#56607A',
  border: '#D9E4FF',
  brand: '#1D2B64',
  brandSecondary: '#3A63FF',
  highlight: '#90E86A'
};

function SplashScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <SafeAreaView style={[styles.safeArea, { justifyContent: 'center' }]}> 
      <View style={styles.splashWrap}>
        <View style={styles.splashOrb} />
        <Text style={styles.splashTitle}>Boost Your Lunch</Text>
        <Text style={styles.splashSub}>Fast ordering for families, schools, and programs.</Text>
        <TouchableOpacity style={styles.primaryAction} onPress={onContinue}>
          <Text style={styles.primaryActionText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const { login } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.authWrap}>
        <Text style={styles.kicker}>Account Link</Text>
        <Text style={styles.screenTitle}>Parent Login</Text>
        <Text style={styles.screenSubtitle}>Use your BYL email and temporary access code.</Text>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="parent@email.com" placeholderTextColor="#8EA1CE" style={styles.input} />
          <Text style={styles.inputLabel}>Access Code</Text>
          <TextInput value={code} onChangeText={setCode} placeholder="123456" placeholderTextColor="#8EA1CE" style={styles.input} />
        </View>

        <TouchableOpacity style={styles.primaryAction} onPress={() => login(email || 'parent@boostyourlunch.com')}>
          <Text style={styles.primaryActionText}>Continue to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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
  const { auth } = useAuth();
  const { data, loading, refresh } = useAppData();
  const upcoming = getUpcomingOrders(data.scheduledOrders);
  const nextOrder = upcoming[0];
  const quickActions = ['Order Lunch', 'Upcoming Orders', 'Past Orders', 'My Family', 'Support'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heroAccent} />
          <Text style={styles.heroKicker}>Serving students everywhere</Text>
          <Text style={styles.heroTitle}>Boost Your Lunch</Text>
          <Text style={styles.heroSubtitle}>{auth.email ? `Welcome back, ${auth.email}` : 'School lunches. Handled.'}</Text>
        </View>

        <View style={styles.announcementPanel}>
          <Panel title={data.announcement.title} subtitle={data.announcement.body} badge={data.announcement.ctaLabel?.toUpperCase()} />
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Next Lunch</Text>
            <Text style={styles.summaryValue}>{nextOrder ? formatDateLabel(nextOrder.serviceDate) : '--'}</Text>
            <Text style={styles.summaryMeta}>{nextOrder ? nextOrder.childName : 'No upcoming lunches'}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Upcoming</Text>
            <Text style={styles.summaryValue}>{upcoming.length}</Text>
            <Text style={styles.summaryMeta}>Active orders</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.secondaryAction} onPress={refresh}>
          <Text style={styles.secondaryActionText}>{loading ? 'Refreshing...' : 'Refresh dashboard'}</Text>
        </TouchableOpacity>

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
  const { data } = useAppData();
  const [selectedChildId, setSelectedChildId] = useState(data.children[0]?.id ?? '');
  const [selectedProgram, setSelectedProgram] = useState(data.programs[0]);
  const [selectedDates, setSelectedDates] = useState<string[]>([data.serviceDates[0]]);
  const selectedChild = data.children.find((child) => child.id === selectedChildId);

  const toggleDate = (date: string) => {
    setSelectedDates((prev) => {
      if (prev.includes(date)) return prev.length === 1 ? prev : prev.filter((d) => d !== date);
      return [...prev, date];
    });
  };

  return (
    <Screen title="Order Lunch" subtitle="Build a schedule draft before checkout.">
      <Text style={styles.sectionLabel}>1) Choose child</Text>
      <View style={styles.toggleRowWrap}>
        {data.children.map((child) => (
          <TouchableOpacity key={child.id} style={[styles.filterChip, selectedChildId === child.id && styles.filterChipActive]} onPress={() => setSelectedChildId(child.id)}>
            <Text style={[styles.filterChipText, selectedChildId === child.id && styles.filterChipTextActive]}>{child.firstName}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>2) Program</Text>
      <View style={styles.toggleRowWrap}>
        {data.programs.map((program) => (
          <TouchableOpacity key={program} style={[styles.filterChip, selectedProgram === program && styles.filterChipActive]} onPress={() => setSelectedProgram(program)}>
            <Text style={[styles.filterChipText, selectedProgram === program && styles.filterChipTextActive]}>{program}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>3) Service dates</Text>
      <View style={styles.toggleRowWrap}>
        {data.serviceDates.map((date) => (
          <TouchableOpacity key={date} style={[styles.filterChip, selectedDates.includes(date) && styles.filterChipActive]} onPress={() => toggleDate(date)}>
            <Text style={[styles.filterChipText, selectedDates.includes(date) && styles.filterChipTextActive]}>{formatDateLabel(date)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Panel title="Draft Review" subtitle={`${selectedChild?.firstName ?? 'Child'} • ${selectedProgram} • ${selectedDates.length} date(s) selected`} badge="READY" />
      <TouchableOpacity style={styles.primaryAction}><Text style={styles.primaryActionText}>Proceed to Checkout</Text></TouchableOpacity>
    </Screen>
  );
}

function UpcomingOrdersScreen({ navigation }: any) {
  const { data } = useAppData();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Editable' | 'Locked'>('All');

  const orders = getUpcomingOrders(data.scheduledOrders);
  const filteredOrders = orders.filter((order) => (statusFilter === 'All' ? true : order.status === statusFilter));

  const groupedByDate = useMemo(() => filteredOrders.reduce<Record<string, ScheduledOrderItem[]>>((acc, item) => {
    if (!acc[item.serviceDate]) acc[item.serviceDate] = [];
    acc[item.serviceDate].push(item);
    return acc;
  }, {}), [filteredOrders]);

  return (
    <Screen title="Upcoming Orders" subtitle="Toggle between list and calendar presentation.">
      <View style={styles.toggleRow}>
        {(['list', 'calendar'] as const).map((mode) => (
          <TouchableOpacity key={mode} style={[styles.toggleButton, viewMode === mode && styles.toggleButtonActive]} onPress={() => setViewMode(mode)}>
            <Text style={[styles.toggleButtonText, viewMode === mode && styles.toggleButtonTextActive]}>{mode === 'list' ? 'List View' : 'Calendar View'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.toggleRowWrap}>
        {(['All', 'Editable', 'Locked'] as const).map((status) => (
          <TouchableOpacity key={status} style={[styles.filterChip, statusFilter === status && styles.filterChipActive]} onPress={() => setStatusFilter(status)}>
            <Text style={[styles.filterChipText, statusFilter === status && styles.filterChipTextActive]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {viewMode === 'list' && filteredOrders.map((row) => (
        <TouchableOpacity key={row.id} style={styles.panel} onPress={() => navigation.getParent()?.navigate('OrderDetail', { orderId: row.id })}>
          <View style={styles.panelTopRow}><Text style={styles.panelTitle}>{row.childName}</Text><Text style={styles.datePill}>{formatDateLabel(row.serviceDate)}</Text></View>
          <Text style={styles.panelSubtitle}>{`${row.program} • ${row.menuItem}`}</Text>
          <Text style={styles.metaStatus}>{toUserStatus(row)}</Text>
        </TouchableOpacity>
      ))}

      {viewMode === 'calendar' && Object.entries(groupedByDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, rows]) => (
        <View key={date} style={styles.panel}>
          <Text style={styles.panelTitle}>{formatDateLabel(date)}</Text>
          {rows.map((row) => (
            <TouchableOpacity key={row.id} style={styles.calendarLine} onPress={() => navigation.getParent()?.navigate('OrderDetail', { orderId: row.id })}>
              <Text style={styles.calendarLineText}>{`${row.childName} • ${row.menuItem}`}</Text>
              <Text style={styles.calendarLineMeta}>{toUserStatus(row)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </Screen>
  );
}

function PastOrdersScreen() {
  const { data } = useAppData();
  const past = getPastOrders(data.scheduledOrders);
  return <Screen title="Past Orders" subtitle="Completed and cancelled history.">{past.map((order) => <Panel key={order.id} title={`${order.childName} • ${formatDateLabel(order.serviceDate)}`} subtitle={`${order.program} • ${order.menuItem}`} badge={toUserStatus(order).toUpperCase()} />)}</Screen>;
}

function FamilyScreen({ navigation }: any) {
  const { data } = useAppData();
  return <Screen title="My Family" subtitle="Children, school assignments, and notes.">{data.children.map((child) => <TouchableOpacity key={child.id} style={styles.panel} onPress={() => navigation.getParent()?.navigate('ChildDetail', { childId: child.id })}><Text style={styles.panelTitle}>{`${child.firstName} ${child.lastName ?? ''}`.trim()}</Text><Text style={styles.panelSubtitle}>{`${child.school} • ${child.classroom} • Grade ${child.grade}`}</Text></TouchableOpacity>)}<Panel title="Add Child" subtitle="Next: connect to full create/edit child form" /></Screen>;
}

function SupportScreen() {
  const { data } = useAppData();
  return <Screen title="Support" subtitle="Submit requests and track replies."><Panel title="Create New Request" subtitle="Order Help, Cancellation/Refund, School Question, App Issue, General" />{data.supportThreads.map((thread) => <Panel key={thread.id} title={thread.subject} subtitle={`${thread.category} • Updated ${thread.updatedAt}`} badge={thread.unread ? 'UNREAD' : 'OPEN'} />)}</Screen>;
}

function NotificationsScreen() {
  const { data } = useAppData();
  return <Screen title="Notifications" subtitle="In-app message log for all push events.">{data.notificationLog.map((note) => <Panel key={note} title={note} subtitle="Tap to view details" />)}</Screen>;
}

function SettingsScreen() {
  const [morningReminder, setMorningReminder] = useState(true);
  const [deadlineReminder, setDeadlineReminder] = useState(true);
  const { auth, logout } = useAuth();
  return (
    <Screen title="Settings" subtitle="Account, notifications, and preferences.">
      <Panel title="Logged in as" subtitle={auth.email ?? 'Unknown'} />
      <View style={styles.settingsRow}><View><Text style={styles.panelTitle}>Morning-of reminder</Text><Text style={styles.panelSubtitle}>Send a notification on lunch days</Text></View><Switch value={morningReminder} onValueChange={setMorningReminder} trackColor={{ true: '#C6F4A6' }} thumbColor={morningReminder ? '#3A63FF' : '#C5C5C5'} /></View>
      <View style={styles.settingsRow}><View><Text style={styles.panelTitle}>Ordering deadline reminder</Text><Text style={styles.panelSubtitle}>Notify before nightly cutoff time</Text></View><Switch value={deadlineReminder} onValueChange={setDeadlineReminder} trackColor={{ true: '#C6F4A6' }} thumbColor={deadlineReminder ? '#3A63FF' : '#C5C5C5'} /></View>
      <Panel title="Linked Account" subtitle="Shopify customer connected" />
      <TouchableOpacity style={styles.logoutButton} onPress={logout}><Text style={styles.logoutText}>Log Out</Text></TouchableOpacity>
      <Panel title="App Version" subtitle="0.7.0" />
    </Screen>
  );
}

function OrderDetailScreen({ route }: any) {
  const { data } = useAppData();
  const order = data.scheduledOrders.find((item) => item.id === route.params.orderId);
  if (!order) return <Screen title="Order Detail" subtitle="Order not found."><Panel title="Missing order" subtitle="Please go back and select another order." /></Screen>;
  return <Screen title="Order Detail" subtitle="Backend eligibility controls modify/cancel actions."><Panel title="Child" subtitle={order.childName} /><Panel title="Service Date" subtitle={formatDateLabel(order.serviceDate)} /><Panel title="Program" subtitle={order.program} /><Panel title="Item" subtitle={order.menuItem} /><Panel title="Status" subtitle={toUserStatus(order)} badge={order.status === 'Editable' ? 'CAN MODIFY' : 'LOCKED'} /><Panel title="Shopify Reference" subtitle={order.shopifyOrderRef ?? 'Pending'} /></Screen>;
}

function ChildDetailScreen({ route }: any) {
  const { data } = useAppData();
  const child = data.children.find((item) => item.id === route.params.childId);
  if (!child) return <Screen title="Child Detail" subtitle="Child not found."><Panel title="Missing child profile" subtitle="Please return to My Family and try again." /></Screen>;
  return <Screen title="Child Detail" subtitle="Manage profile, school, class, and notes."><Panel title="Name" subtitle={`${child.firstName} ${child.lastName ?? ''}`.trim()} /><Panel title="School/Class" subtitle={`${child.school} • ${child.classroom}`} /><Panel title="Grade" subtitle={child.grade} /><Panel title="Notes" subtitle={child.notes ?? 'No notes'} /><Panel title="Status" subtitle={child.active ? 'Active' : 'Inactive'} /></Screen>;
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: byrTheme.surface, borderTopColor: '#CFE0FF', borderTopWidth: 1, height: 72, paddingBottom: 10, paddingTop: 8 }, tabBarActiveTintColor: byrTheme.brandSecondary, tabBarInactiveTintColor: '#7A89A6' }}>
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

function AuthedApp() {
  return <NavigationContainer><StatusBar style="light" /><Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: byrTheme.brand }, headerTintColor: '#FFFFFF', headerTitleStyle: { fontWeight: '700' } }}><Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} /><Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Order Detail / Modify' }} /><Stack.Screen name="ChildDetail" component={ChildDetailScreen} options={{ title: 'Child Detail / Edit' }} /></Stack.Navigator></NavigationContainer>;
}

function Root() {
  const [seenSplash, setSeenSplash] = useState(false);
  const { auth } = useAuth();
  if (!seenSplash) return <SplashScreen onContinue={() => setSeenSplash(true)} />;
  if (auth.status === 'signed_out') return <LoginScreen />;
  return <AuthedApp />;
}

export default function App() {
  return <AuthProvider><AppDataProvider><Root /></AppDataProvider></AuthProvider>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: byrTheme.bg },
  container: { padding: 16, gap: 14, paddingBottom: 28 },
  splashWrap: { margin: 16, padding: 24, borderRadius: 24, backgroundColor: byrTheme.brand, shadowColor: '#1D2B64', shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  splashOrb: { position: 'absolute', width: 180, height: 180, borderRadius: 999, backgroundColor: '#4D7BFF', top: -70, right: -50, opacity: 0.4 },
  splashTitle: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 },
  splashSub: { color: '#D7E2FF', fontSize: 15, marginBottom: 22 },
  authWrap: { padding: 16, gap: 12 },
  inputCard: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: byrTheme.border, padding: 14, gap: 8 },
  inputLabel: { color: byrTheme.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  input: { borderWidth: 1, borderColor: '#C9D8FF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: byrTheme.text, backgroundColor: byrTheme.bgAlt },
  hero: { backgroundColor: byrTheme.brand, borderRadius: 24, padding: 18, overflow: 'hidden', shadowColor: '#1D2B64', shadowOpacity: 0.32, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  heroAccent: { position: 'absolute', width: 180, height: 180, borderRadius: 999, backgroundColor: '#4D7BFF', top: -60, right: -50, opacity: 0.4 },
  heroKicker: { textTransform: 'uppercase', fontSize: 11, letterSpacing: 1, fontWeight: '700', color: '#C9D9FF' },
  heroTitle: { marginTop: 6, fontSize: 30, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.4 },
  heroSubtitle: { marginTop: 4, color: '#D7E2FF', fontSize: 16 },
  announcementPanel: { backgroundColor: '#DDF1CF', borderRadius: 20, padding: 3 },
  summaryRow: { gap: 10 },
  summaryCard: { backgroundColor: byrTheme.surface, borderRadius: 18, borderWidth: 1, borderColor: byrTheme.border, padding: 14, shadowColor: '#2E4FAE', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  summaryLabel: { color: byrTheme.muted, fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  summaryValue: { marginTop: 6, fontSize: 30, color: byrTheme.brand, fontWeight: '800' },
  summaryMeta: { marginTop: 2, color: byrTheme.muted, fontSize: 13 },
  pageHeader: { marginBottom: 2 },
  kicker: { textTransform: 'uppercase', fontSize: 11, letterSpacing: 1, fontWeight: '700', color: '#5772BF', marginBottom: 4 },
  screenTitle: { fontSize: 30, fontWeight: '800', color: byrTheme.text, letterSpacing: -0.6 },
  screenSubtitle: { marginTop: 4, color: byrTheme.muted, fontSize: 14 },
  sectionLabel: { marginTop: 6, marginBottom: 2, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#385CBF', fontWeight: '700' },
  primaryAction: { borderRadius: 16, backgroundColor: byrTheme.brandSecondary, paddingVertical: 15, paddingHorizontal: 16, shadowColor: '#3A63FF', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 6 },
  primaryActionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  secondaryAction: { borderRadius: 12, borderWidth: 1, borderColor: '#C9D8FF', backgroundColor: '#FFFFFF', paddingVertical: 10 },
  secondaryActionText: { textAlign: 'center', color: '#3658B7', fontWeight: '700' },
  panel: { backgroundColor: byrTheme.surface, borderRadius: 18, borderWidth: 1, borderColor: byrTheme.border, padding: 14, shadowColor: '#2F4EA5', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  panelTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  panelTitle: { color: byrTheme.text, fontSize: 16, fontWeight: '700', flexShrink: 1 },
  panelSubtitle: { color: byrTheme.muted, marginTop: 5, fontSize: 14, lineHeight: 20 },
  badge: { backgroundColor: '#1D2B64', color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.8, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999, overflow: 'hidden' },
  datePill: { borderRadius: 999, backgroundColor: '#ECF2FF', borderWidth: 1, borderColor: '#BFD0FF', paddingHorizontal: 8, paddingVertical: 4, fontSize: 12, color: '#2440A4', fontWeight: '700' },
  metaStatus: { marginTop: 10, color: '#5C9B2E', fontWeight: '700', fontSize: 13 },
  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  toggleButton: { flex: 1, borderWidth: 1, borderColor: '#C6D6FF', borderRadius: 14, paddingVertical: 10, alignItems: 'center', backgroundColor: '#FFFFFF' },
  toggleButtonActive: { backgroundColor: byrTheme.brand, borderColor: byrTheme.brand },
  toggleButtonText: { color: byrTheme.text, fontWeight: '600' },
  toggleButtonTextActive: { color: '#FFFFFF' },
  filterChip: { borderWidth: 1, borderColor: '#C9D8FF', borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12, backgroundColor: '#FFFFFF' },
  filterChipActive: { borderColor: byrTheme.brandSecondary, backgroundColor: '#E8EEFF' },
  filterChipText: { color: '#223A8B', fontSize: 13, fontWeight: '600' },
  filterChipTextActive: { color: '#1A2A61' },
  calendarLine: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E4EBFF' },
  calendarLineText: { color: byrTheme.text, fontWeight: '600' },
  calendarLineMeta: { marginTop: 3, color: byrTheme.muted, fontSize: 13 },
  settingsRow: { backgroundColor: byrTheme.surface, borderRadius: 18, borderWidth: 1, borderColor: byrTheme.border, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, shadowColor: '#3A63FF', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  logoutButton: { borderRadius: 12, borderWidth: 1, borderColor: '#ECA6A6', backgroundColor: '#FFF4F4', paddingVertical: 12 },
  logoutText: { textAlign: 'center', color: '#B03030', fontWeight: '700' }
});
