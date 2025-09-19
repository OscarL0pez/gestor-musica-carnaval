'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useEvents, Event, NewEventForm } from '@/hooks/use-events';

interface EventsCalendarProps {
  isAdmin?: boolean;
}

export function EventsCalendar({ isAdmin = false }: EventsCalendarProps) {
  const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<NewEventForm>({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'ensayo',
    description: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  const eventTypeIcons = {
    ensayo: Users,
    actuacion: Calendar,
    reunion: Clock,
    otro: MapPin
  };

  const eventTypeColors = {
    ensayo: 'text-blue-600 border-blue-200 bg-blue-50',
    actuacion: 'text-red-600 border-red-200 bg-red-50',
    reunion: 'text-green-600 border-green-200 bg-green-50',
    otro: 'text-purple-600 border-purple-200 bg-purple-50'
  };

  const getEventDateTime = (event: Event) => {
    return new Date(`${event.date}T${event.time}`);
  };

  const now = new Date();
  const sortedEvents = events.sort((a, b) => getEventDateTime(a).getTime() - getEventDateTime(b).getTime());
  const upcomingEvents = sortedEvents.filter(event => getEventDateTime(event) >= now);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingEvent) {
        // Editar evento existente
        const success = await updateEvent(editingEvent.id, formData);
        if (!success) {
          alert('Error al actualizar el evento');
          return;
        }
      } else {
        // Crear nuevo evento
        const success = await addEvent(formData);
        if (!success) {
          alert('Error al crear el evento');
          return;
        }
      }

      // Resetear formulario
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        type: 'ensayo',
        description: ''
      });
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el evento');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      description: event.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      const success = await deleteEvent(eventId);
      if (!success) {
        alert('Error al eliminar el evento');
      }
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      type: 'ensayo',
      description: ''
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-2 sm:px-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            Calendario de Eventos
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Ensayos, actuaciones y eventos de la comparsa</p>
        </div>
        {isAdmin && (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Evento
          </Button>
        )}
      </div>

      {/* Formulario de evento (solo para administradores) */}
      {showForm && isAdmin && (
        <Card className="border-orange-200 mx-2 sm:mx-0">
          <CardContent className="p-3 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    placeholder="Nombre del evento"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de evento *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Event['type'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="ensayo">Ensayo</option>
                    <option value="actuacion">Actuación</option>
                    <option value="reunion">Reunión</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora *
                  </label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación *
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                    placeholder="Lugar del evento"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detalles adicionales del evento"
                    rows={3}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingEvent ? 'Guardando...' : 'Creando...'}
                    </>
                  ) : (
                    editingEvent ? 'Guardar Cambios' : 'Crear Evento'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={cancelForm}
                  disabled={formLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de eventos */}
      <div className="grid gap-3 sm:gap-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 px-2 sm:px-0">Próximos Eventos</h3>
        
        {loading ? (
          <Card className="mx-2 sm:mx-0">
            <CardContent className="p-4 sm:p-6 text-center">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mx-auto mb-3 sm:mb-4 animate-spin" />
              <p className="text-gray-500 text-sm sm:text-base">Cargando eventos...</p>
            </CardContent>
          </Card>
        ) : upcomingEvents.length === 0 ? (
          <Card className="mx-2 sm:mx-0">
            <CardContent className="p-4 sm:p-6 text-center">
              <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">No hay eventos próximos programados</p>
              {isAdmin && (
                <p className="text-gray-400 text-sm mt-2">
                  ¡Usa el botón &quot;Nuevo Evento&quot; para añadir el primer evento!
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          upcomingEvents.map((event) => {
            const IconComponent = eventTypeIcons[event.type];
            return (
              <Card key={event.id} className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] sm:hover:scale-[1.02] mx-2 sm:mx-0">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className={`p-1.5 sm:p-2 rounded-full bg-opacity-20 ${eventTypeColors[event.type].split(' ')[0].replace('text-', 'bg-')} flex-shrink-0`}>
                          <IconComponent className={`h-3 w-3 sm:h-4 sm:w-4 ${eventTypeColors[event.type].split(' ')[0]}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{event.title}</h4>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full border mt-1 ${eventTypeColors[event.type]}`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600 ml-7 sm:ml-11">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{new Date(event.date).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        {event.description && (
                          <p className="text-gray-600 mt-2 text-xs sm:text-sm line-clamp-2">{event.description}</p>
                        )}
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(event)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(event.id)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 text-xs"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Eventos pasados */}
      {sortedEvents.filter(event => getEventDateTime(event) < now).length > 0 && (
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Eventos Pasados</h3>
          {sortedEvents
            .filter(event => getEventDateTime(event) < now)
            .slice(0, 3)
            .map((event) => {
              const IconComponent = eventTypeIcons[event.type];
              return (
                <Card key={event.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-full bg-gray-100">
                            <IconComponent className="h-4 w-4 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-600">{event.title}</h4>
                            <span className="inline-block px-2 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-500">
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-500 ml-11">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(event.date).toLocaleDateString('es-ES')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}