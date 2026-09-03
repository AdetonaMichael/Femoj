"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Search, Loader2, Save } from "lucide-react";
import { useAdminServices, useAdminUpdatePricing } from "@/hooks/useAdmin";
import { toast } from "sonner";

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { services, isLoading } = useAdminServices();
  const updatePricing = useAdminUpdatePricing();

  const filteredServices = services?.filter((service: any) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdatePricing = async (
    serviceId: number,
    countryId: number,
    activationPrice: number,
    rentPrice: number
  ) => {
    await updatePricing.mutateAsync({
      serviceId,
      payload: {
        country_id: countryId,
        credit_price_activation: activationPrice,
        credit_price_rent_30d: rentPrice,
      },
    });
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <h1 className="text-4xl font-bold mb-2">Services & Pricing</h1>
        <p className="text-muted-foreground">
          Manage service credit pricing configuration
        </p>
      </motion.div>

      {/* Search */}
      <motion.div variants={staggerItem}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Services List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {filteredServices?.map((service: any) => (
            <motion.div key={service.id} variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">{service.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      ({service.category})
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Credit pricing for {service.service_countries?.length ?? 0} countries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Country</th>
                          <th className="text-left py-3 px-4 font-semibold">Activation Price (NGN)</th>
                          <th className="text-left py-3 px-4 font-semibold">Rent Price (NGN)</th>
                          <th className="text-left py-3 px-4 font-semibold">Activation Credits</th>
                          <th className="text-left py-3 px-4 font-semibold">Rent Credits</th>
                          <th className="text-center py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {service.service_countries?.map((sc: any) => (
                          <CountryPricingRow
                            key={sc.id}
                            serviceCountry={sc}
                            serviceId={service.id}
                            onUpdate={handleUpdatePricing}
                            isUpdating={updatePricing.isPending}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function CountryPricingRow({
  serviceCountry,
  serviceId,
  onUpdate,
  isUpdating,
}: {
  serviceCountry: any;
  serviceId: number;
  onUpdate: (
    serviceId: number,
    countryId: number,
    activationPrice: number,
    rentPrice: number
  ) => Promise<any>;
  isUpdating: boolean;
}) {
  const [activationCredits, setActivationCredits] = useState(
    serviceCountry.credit_price_activation ?? 0
  );
  const [rentCredits, setRentCredits] = useState(
    serviceCountry.credit_price_rent_30d ?? 0
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    await onUpdate(serviceId, serviceCountry.country_id, activationCredits, rentCredits);
    setIsEditing(false);
  };

  return (
    <tr className="border-b border-border hover:bg-muted transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span>{serviceCountry.country?.flag_emoji}</span>
          <span>{serviceCountry.country?.name}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        ₦{(serviceCountry.activation_price ?? 0).toLocaleString()}
      </td>
      <td className="py-3 px-4">
        ₦{(serviceCountry.rent_price_30d ?? 0).toLocaleString()}
      </td>
      <td className="py-3 px-4">
        {isEditing ? (
          <input
            type="number"
            value={activationCredits}
            onChange={(e) => setActivationCredits(Number(e.target.value))}
            className="w-24 px-2 py-1 border border-border rounded text-sm"
          />
        ) : (
          <span className="font-medium">{activationCredits} credits</span>
        )}
      </td>
      <td className="py-3 px-4">
        {isEditing ? (
          <input
            type="number"
            value={rentCredits}
            onChange={(e) => setRentCredits(Number(e.target.value))}
            className="w-24 px-2 py-1 border border-border rounded text-sm"
          />
        ) : (
          <span className="font-medium">{rentCredits} credits</span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {isEditing ? (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </td>
    </tr>
  );
}
