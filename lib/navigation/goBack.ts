import { router, type Href } from 'expo-router';

/** Web 直达或无历史栈时 router.back() 会失效，回退到 fallback */
export function goBackOr(fallback: Href = '/home') {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallback);
}
