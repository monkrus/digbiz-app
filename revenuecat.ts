import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEYS: Record<string, string> = {
  ios: 'REVENUECAT_IOS_API_KEY',
  android: 'REVENUECAT_ANDROID_API_KEY',
};

export function configureRevenueCat() {
  const apiKey = API_KEYS[Platform.OS];
  if (apiKey) {
    Purchases.configure({ apiKey });
  }
}

export async function isProUser(): Promise<boolean> {
  try {
    const info = await Purchases.getCustomerInfo();
    return Boolean(
      info.entitlements.active['pro'] || info.entitlements.active['team']
    );
  } catch (e) {
    console.warn('RevenueCat check failed', e);
    return false;
  }
}

export async function purchaseSubscription() {
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages[0];
    if (pkg) {
      await Purchases.purchasePackage(pkg);
    }
  } catch (e) {
    console.warn('Purchase failed', e);
  }
}
