"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input, Container } from "@/components/ui";
import { MOCK_NUMBERS, MOCK_COUNTRIES_EXTENDED } from "@/mock/data";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import {
  Search,
  Filter,
  Plus,
  Globe,
  MessageCircle,
  Phone,
  Clock,
  Star,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils";
import { toast } from "sonner";

export default function NumbersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handlePurchase = (number: string) => {
    toast.success(`Successfully purchased ${number}`);
  };

  const handleRenew = (number: string) => {
    toast.success(`Renewal requested for ${number}`);
  };

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={staggerItem}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Virtual Numbers</h1>
              <p className="text-muted-foreground">
                Buy, rent, and manage virtual numbers from around the world
              </p>
            </div>
            <Button size="lg" className="gap-2" asChild>
              <a href="#marketplace">
                <Plus className="w-4 h-4" />
                Buy Number
              </a>
            </Button>
          </div>
        </motion.div>

        {/* My Numbers */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>My Numbers</CardTitle>
              <CardDescription>
                Your active and expired virtual numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_NUMBERS.map((number) => (
                  <motion.div
                    key={number.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-primary" />
                        <p className="text-lg font-semibold">
                          {number.number}
                        </p>
                        <Badge>{number.country}</Badge>
                        {number.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="warning">Expired</Badge>
                        )}
                      </div>
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          SMS: {number.capabilities.sms ? "✓" : "✗"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          Voice: {number.capabilities.voice ? "✓" : "✗"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Expires: {formatDate(number.expiryDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRenew(number.number)}
                      >
                        Renew
                      </Button>
                      <Button variant="ghost" size="sm">
                        More
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Number Marketplace */}
        <motion.div variants={staggerItem} id="marketplace">
          <Card>
            <CardHeader>
              <CardTitle>Number Marketplace</CardTitle>
              <CardDescription>
                Browse and purchase numbers from available countries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search country..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="input-base"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="temporary">Temporary (30 days)</option>
                  <option value="permanent">Permanent</option>
                </select>

                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </div>

              {/* Countries Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {MOCK_COUNTRIES_EXTENDED.map((country) => (
                  <motion.div
                    key={country.code}
                    className="p-4 rounded-lg border border-border hover:shadow-lg transition-shadow cursor-pointer group"
                    variants={staggerItem}
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-2xl mb-2">{country.flag}</p>
                        <h3 className="font-semibold text-lg">
                          {country.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {country.dialCode}
                        </p>
                      </div>
                      <Star className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    <div className="space-y-2 mb-4 py-3 border-y border-border">
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">
                          Temporary (30 days)
                        </p>
                        <p className="font-bold">
                          {formatCurrency(country.pricing.temporary)}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">
                          Permanent
                        </p>
                        <p className="font-bold">
                          {formatCurrency(country.pricing.permanent)}
                          <span className="text-xs text-muted-foreground">
                            {" "}/month
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {country.numbersAvailable} numbers available
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() =>
                            handlePurchase(`temporary from ${country.name}`)
                          }
                        >
                          Rent
                        </Button>
                        <Button
                          size="sm"
                          fullWidth
                          onClick={() =>
                            handlePurchase(`permanent from ${country.name}`)
                          }
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Countries", value: "150+" },
                  { label: "Available Numbers", value: "50K+" },
                  { label: "Average Uptime", value: "99.9%" },
                  { label: "Active Users", value: "10K+" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
