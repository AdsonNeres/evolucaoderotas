
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { User, Clipboard } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter no mínimo 2 caracteres" }),
  totalOrders: z.coerce.number().min(1, { message: "Mínimo de 1 pedido" }),
  region: z.string().min(1, { message: "Selecione uma região" }),
});

const AddDriverForm: React.FC = () => {
  const { setDrivers } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      totalOrders: undefined,
      region: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const today = new Date().toISOString().split('T')[0];
    
    const newDriver = {
      id: uuidv4(),
      name: values.name,
      date: today,
      vehicle: values.region === "São Paulo" ? "Veículo - SP" : "Veículo - RJ",
      region: values.region,
      totalOrders: values.totalOrders,
      delivered: 0,
      pending: values.totalOrders,
      unsuccessful: 0,
      route: 0,
      deliveryPercentage: 0,
    };

    setDrivers(prev => [...prev, newDriver]);
    toast.success(`Motorista ${values.name} adicionado com sucesso!`);
    form.reset();
    setIsOpen(false);
  };

  return (
    <div className="glass-card p-4 mb-6 animate-fade-in">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 px-4 flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <User size={18} />
          Adicionar novo motorista manualmente
        </button>
      ) : (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Clipboard size={18} className="text-blue-500" />
              Adicionar Motorista
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Motorista</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="totalOrders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total de Pedidos</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Região</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a região" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Rio de Janeiro">Rio De Janeiro</SelectItem>
                          <SelectItem value="São Paulo">São Paulo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Adicionar Motorista
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default AddDriverForm;
