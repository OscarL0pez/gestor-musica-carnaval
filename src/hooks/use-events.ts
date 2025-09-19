'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'ensayo' | 'actuacion' | 'reunion' | 'otro';
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NewEventForm {
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'ensayo' | 'actuacion' | 'reunion' | 'otro';
  description: string;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar eventos de Supabase al iniciar
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error loading events:', error);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error conectando con Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (eventData: NewEventForm): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: eventData.title,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          type: eventData.type,
          description: eventData.description || null
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding event:', error);
        return false;
      }

      // Actualizar estado local
      setEvents(prev => [...prev, data].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      }));

      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      return false;
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<NewEventForm>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          ...eventData,
          description: eventData.description || null
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        return false;
      }

      // Actualizar estado local
      setEvents(prev => prev.map(event => 
        event.id === eventId ? data : event
      ).sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      }));

      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        return false;
      }

      // Actualizar estado local
      setEvents(prev => prev.filter(event => event.id !== eventId));
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    loadEvents
  };
}