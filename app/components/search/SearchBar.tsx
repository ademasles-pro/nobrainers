'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NodeType } from '@/types/graph';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: NodeType[]) => void;
  selectedFilters: NodeType[];
}

// Maps NodeType to human-readable labels
const nodeTypeLabels: Record<NodeType, string> = {
  person: 'People',
  conversation: 'Conversations',
  artifact: 'Artifacts',
  agent: 'Agents',
  action: 'Actions',
};

export const SearchBar = ({ 
  onSearch, 
  onFilterChange, 
  selectedFilters 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  // Handle search query change
  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  // Toggle a filter on/off
  const toggleFilter = (type: NodeType) => {
    const newFilters = selectedFilters.includes(type)
      ? selectedFilters.filter(f => f !== type)
      : [...selectedFilters, type];
    onFilterChange(newFilters);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Search input field with icon */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search nodes, conversations, artifacts..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-card border-border text-foreground"
        />
      </div>
      
      {/* Filter dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="border-border">
            <Filter className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {(Object.keys(nodeTypeLabels) as NodeType[]).map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={selectedFilters.includes(type)}
              onCheckedChange={() => toggleFilter(type)}
            >
              {nodeTypeLabels[type]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

