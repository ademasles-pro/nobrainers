'use client';

import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, FileText, Bot, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

/**
 * Dashboard page - Main entry point of the application
 * Displays overview statistics, recent activity, and quick actions
 */
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header section with title and link to graph view */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Enterprise Graph Brain
            </h1>
            <p className="text-muted-foreground">
              Intelligence contextuelle et mémoire organisationnelle
            </p>
          </div>
          <Link href="/graph">
            <Button className="bg-gradient-primary hover:shadow-glow-primary transition-all">
              <Activity className="w-4 h-4 mr-2" />
              Voir le Graphe
            </Button>
          </Link>
        </div>

        {/* Statistics grid displaying key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Personnes"
            value="247"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            description="Employés actifs"
          />
          <StatsCard
            title="Conversations"
            value="1,842"
            icon={MessageSquare}
            trend={{ value: 8, isPositive: true }}
            description="Cette semaine"
          />
          <StatsCard
            title="Artefacts"
            value="3,567"
            icon={FileText}
            trend={{ value: 15, isPositive: true }}
            description="Documents & assets"
          />
          <StatsCard
            title="Agents IA"
            value="24"
            icon={Bot}
            trend={{ value: 4, isPositive: true }}
            description="Actifs en production"
          />
        </div>

        {/* Main content grid with recent activity and quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity section */}
          <Card className="lg:col-span-2 p-6 bg-gradient-surface border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Activité Récente</h2>
              <Button variant="ghost" size="sm">Voir tout</Button>
            </div>
            <div className="space-y-4">
              {[
                {
                  type: 'conversation',
                  title: 'Q2 Planning Discussion',
                  user: 'Alice Chen',
                  time: 'Il y a 2h',
                  color: 'bg-node-conversation',
                },
                {
                  type: 'artifact',
                  title: 'API Spec v2 approuvé',
                  user: 'Bob Smith',
                  time: 'Il y a 4h',
                  color: 'bg-node-artifact',
                },
                {
                  type: 'agent',
                  title: 'Code Reviewer: 12 PRs analysées',
                  user: 'System',
                  time: 'Il y a 6h',
                  color: 'bg-node-agent',
                },
                {
                  type: 'action',
                  title: 'Design Review complété',
                  user: 'Carol White',
                  time: 'Il y a 8h',
                  color: 'bg-node-action',
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border hover:border-primary transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${activity.color} mt-2`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions section */}
          <Card className="p-6 bg-gradient-surface border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">Actions Rapides</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyser Tendances
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Nouvelles Conversations
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Créer Document
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bot className="w-4 h-4 mr-2" />
                Configurer Agent
              </Button>
            </div>

            {/* AI recommendation section */}
            <div className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-foreground mb-2">💡 Recommandation IA</p>
              <p className="text-xs text-muted-foreground">
                Le projet "Dashboard Redesign" nécessite une validation. 
                3 personnes clés identifiées.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2 text-accent">
                Voir les détails →
              </Button>
            </div>
          </Card>
        </div>

        {/* Knowledge Graph Overview section showing node type distribution */}
        <Card className="p-6 bg-gradient-surface border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Aperçu du Graphe de Connaissances</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Personnes', count: 247, color: 'bg-node-person' },
              { label: 'Conversations', count: 1842, color: 'bg-node-conversation' },
              { label: 'Artefacts', count: 3567, color: 'bg-node-artifact' },
              { label: 'Agents', count: 24, color: 'bg-node-agent' },
              { label: 'Actions', count: 892, color: 'bg-node-action' },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-lg bg-card/50 border border-border">
                <div className={`w-3 h-3 rounded-full ${item.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-foreground">{item.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

