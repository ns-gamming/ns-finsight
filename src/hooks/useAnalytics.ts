import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface EventData {
  eventType: string;
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  metadata?: Record<string, any>;
}

let sessionId: string | null = null;
let sessionStartTime: number | null = null;

const getSessionId = () => {
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStartTime = Date.now();
  }
  return sessionId;
};

const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let deviceType = 'desktop';
  if (/mobile/i.test(ua)) deviceType = 'mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';
  
  let browser = 'unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  let os = 'unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'MacOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';
  
  return { deviceType, browser, os };
};

export const useAnalytics = () => {
  const trackEvent = useCallback(async (eventData: EventData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const pagePath = window.location.pathname;
      
      await supabase.from("user_activity_logs").insert({
        user_id: user.id,
        event_type: eventData.eventType,
        event_category: eventData.eventCategory,
        event_action: eventData.eventAction,
        event_label: eventData.eventLabel,
        page_path: pagePath,
        metadata: eventData.metadata || {},
        user_agent: navigator.userAgent,
        session_id: getSessionId(),
      });
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  }, []);

  const trackPageView = useCallback(async (pagePath: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("page_analytics").insert({
        user_id: user.id,
        page_path: pagePath,
        entry_page: sessionStartTime ? Date.now() - sessionStartTime < 5000 : false,
        referrer: document.referrer,
      });

      await trackEvent({
        eventType: 'page_view',
        eventCategory: 'navigation',
        eventAction: 'view',
        eventLabel: pagePath,
      });
    } catch (error) {
      console.error("Page view tracking error:", error);
    }
  }, [trackEvent]);

  const trackClick = useCallback(async (elementId: string, context: string) => {
    await trackEvent({
      eventType: 'click',
      eventCategory: 'interaction',
      eventAction: 'click',
      eventLabel: elementId,
      metadata: { context },
    });
  }, [trackEvent]);

  const trackFormSubmit = useCallback(async (formName: string, success: boolean) => {
    await trackEvent({
      eventType: 'form_submit',
      eventCategory: 'form',
      eventAction: success ? 'submit_success' : 'submit_error',
      eventLabel: formName,
      metadata: { success },
    });
  }, [trackEvent]);

  const initSession = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { deviceType, browser, os } = getDeviceInfo();
      
      await supabase.from("user_sessions").insert({
        id: getSessionId(),
        user_id: user.id,
        device_type: deviceType,
        browser,
        os,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error("Session init error:", error);
    }
  }, []);

  const endSession = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !sessionId || !sessionStartTime) return;

      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);

      await supabase
        .from("user_sessions")
        .update({
          session_end: new Date().toISOString(),
          duration_seconds: duration,
        })
        .eq("id", sessionId);
    } catch (error) {
      console.error("Session end error:", error);
    }
  }, []);

  useEffect(() => {
    initSession();
    
    window.addEventListener('beforeunload', endSession);
    return () => {
      window.removeEventListener('beforeunload', endSession);
    };
  }, [initSession, endSession]);

  return { trackEvent, trackPageView, trackClick, trackFormSubmit };
};
