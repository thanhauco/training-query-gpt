import React, { useLayoutEffect, useState, useMemo } from 'react';
import type { Table } from '../types';

interface SchemaDiagramProps {
  tables: Table[];
  selectedTableNames: string[];
  onTableSelect: (tableName: string) => void;
}

interface Relationship {
  fromTable: string;
  toTable: string;
}

interface Line {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const TABLE_WIDTH = 192; // w-48
const COL_GAP = 96; // 6rem
const ROW_GAP = 32; // 2rem

// Heuristic to find relationships between tables
const findRelationships = (tables: Table[]): Relationship[] => {
    const relationships: Relationship[] = [];
    const pkMap = new Map<string, string>(); // Map<columnName (lowercase), tableName>

    tables.forEach(table => {
        if (table.columns.length > 0) {
            const firstColName = table.columns[0].name.toLowerCase();
            if (!pkMap.has(firstColName)) {
                pkMap.set(firstColName, table.name);
            }
        }
    });

    tables.forEach(table => {
        table.columns.forEach(column => {
            const colNameLower = column.name.toLowerCase();
            const firstColOfCurrentTable = table.columns.length > 0 ? table.columns[0].name.toLowerCase() : '';
            if (colNameLower !== firstColOfCurrentTable && pkMap.has(colNameLower)) {
                const toTable = pkMap.get(colNameLower);
                if (toTable && toTable !== table.name) {
                    relationships.push({ fromTable: table.name, toTable });
                }
            }
        });
    });

    const uniqueRels: Relationship[] = [];
    const seen = new Set<string>();
    relationships.forEach(rel => {
        const sortedNames = [rel.fromTable, rel.toTable].sort().join('--');
        if (!seen.has(sortedNames)) {
            uniqueRels.push(rel);
            seen.add(sortedNames);
        }
    });

    return uniqueRels;
};

const SchemaDiagram: React.FC<SchemaDiagramProps> = ({ tables, selectedTableNames, onTableSelect }) => {
    const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [lines, setLines] = useState<Line[]>([]);

    const relationships = useMemo(() => findRelationships(tables), [tables]);

    useLayoutEffect(() => {
        if (tables.length === 0) {
            setPositions(new Map());
            setContainerSize({ width: 0, height: 0 });
            setLines([]);
            return;
        }

        // 1. Build Adjacency List for graph traversal
        const adj = new Map<string, string[]>();
        tables.forEach(t => adj.set(t.name, []));
        relationships.forEach(({ fromTable, toTable }) => {
            adj.get(fromTable)!.push(toTable);
            adj.get(toTable)!.push(fromTable);
        });

        // 2. Find Connected Components in the graph
        const visited = new Set<string>();
        const components: string[][] = [];
        tables.forEach(table => {
            if (!visited.has(table.name)) {
                const component: string[] = [];
                const queue: string[] = [table.name];
                visited.add(table.name);
                while (queue.length > 0) {
                    const u = queue.shift()!;
                    component.push(u);
                    (adj.get(u) || []).forEach(v => {
                        if (!visited.has(v)) {
                            visited.add(v);
                            queue.push(v);
                        }
                    });
                }
                components.push(component);
            }
        });

        // 3. Layout algorithm: position nodes for each component
        const newPositions = new Map<string, { x: number; y: number }>();
        let currentXOffset = 0;
        let overallMaxHeight = 0;

        components.forEach((component) => {
            // Start BFS from the most connected node in the component
            const startNode = component.reduce((a, b) => ((adj.get(a)?.length || 0) > (adj.get(b)?.length || 0) ? a : b), component[0]);
            
            const queue: [string, number][] = [[startNode, 0]];
            const visitedInComponent = new Set([startNode]);
            const nodesByLevel: { [level: number]: string[] } = {};
            let maxLevel = 0;

            while (queue.length > 0) {
                const [u, level] = queue.shift()!;
                if (!nodesByLevel[level]) nodesByLevel[level] = [];
                nodesByLevel[level].push(u);
                maxLevel = Math.max(maxLevel, level);

                (adj.get(u) || []).forEach(v => {
                    if (!visitedInComponent.has(v)) {
                        visitedInComponent.add(v);
                        queue.push([v, level + 1]);
                    }
                });
            }

            let componentWidth = 0;
            let componentMaxY = 0;
            
            // Calculate positions based on levels (columns)
            Object.entries(nodesByLevel).forEach(([levelStr, nodes]) => {
                const level = parseInt(levelStr, 10);
                let currentY = 0;
                nodes.forEach((nodeName) => {
                    const x = currentXOffset + level * (TABLE_WIDTH + COL_GAP);
                    const y = currentY;
                    newPositions.set(nodeName, { x, y });

                    const table = tables.find(t => t.name === nodeName)!;
                    const tableHeight = 60 + table.columns.length * 18; // Estimate height
                    currentY += tableHeight + ROW_GAP;
                });
                componentMaxY = Math.max(componentMaxY, currentY);
            });
            
            componentWidth = (maxLevel + 1) * (TABLE_WIDTH + COL_GAP) - COL_GAP;
            currentXOffset += componentWidth + COL_GAP * 1.5;
            overallMaxHeight = Math.max(overallMaxHeight, componentMaxY);
        });

        setPositions(newPositions);
        setContainerSize({ width: Math.max(500, currentXOffset - COL_GAP * 1.5), height: Math.max(200, overallMaxHeight - ROW_GAP) });
        
        // 4. Calculate line coordinates based on new positions
        const newLines: Line[] = [];
        relationships.forEach(rel => {
            const fromPos = newPositions.get(rel.fromTable);
            const toPos = newPositions.get(rel.toTable);
            const fromTable = tables.find(t => t.name === rel.fromTable);
            const toTable = tables.find(t => t.name === rel.toTable);

            if (fromPos && toPos && fromTable && toTable) {
                const fromHeight = 60 + fromTable.columns.length * 18;
                const toHeight = 60 + toTable.columns.length * 18;

                const fromMidY = fromPos.y + fromHeight / 2;
                const toMidY = toPos.y + toHeight / 2;
                
                let x1, x2;
                if (toPos.x > fromPos.x) { // To is on the right
                    x1 = fromPos.x + TABLE_WIDTH;
                    x2 = toPos.x;
                } else { // From is on the right (or same column)
                    x1 = fromPos.x;
                    x2 = toPos.x + TABLE_WIDTH;
                }
                
                newLines.push({ key: `${rel.fromTable}-${rel.toTable}`, x1, y1: fromMidY, x2, y2: toMidY });
            }
        });
        setLines(newLines);

    }, [tables, relationships]);

    return (
        <div className="relative p-1 min-h-[200px] overflow-auto bg-gray-900/30 rounded-md">
            <div
              className="relative transition-all duration-500"
              style={{ width: containerSize.width, height: containerSize.height }}
            >
                {tables.map(table => {
                    const isSelected = selectedTableNames.includes(table.name);
                    const pos = positions.get(table.name);
                    if (!pos) return null;

                    return (
                        <div
                            key={table.name}
                            onClick={() => onTableSelect(table.name)}
                            style={{
                                position: 'absolute',
                                left: pos.x,
                                top: pos.y,
                                width: TABLE_WIDTH,
                                transition: 'all 0.5s ease-in-out',
                            }}
                            className={`flex-shrink-0 p-2 rounded-md border-2 cursor-pointer
                                ${isSelected ? 'bg-cyan-900/50 border-cyan-500 shadow-lg' : 'bg-gray-800 border-gray-600 hover:border-gray-500'}
                            `}
                        >
                            <h3 className="font-mono font-bold text-sm text-center mb-2 pb-2 border-b border-gray-700 truncate" title={table.name}>{table.name}</h3>
                            <ul className="space-y-1">
                                {table.columns.map(col => (
                                    <li key={col.name} className="text-xs font-mono text-gray-300 truncate" title={`${col.name} (${col.type})`}>
                                        {col.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                    {lines.map(line => (
                        <path
                            key={line.key}
                            d={`M ${line.x1} ${line.y1} C ${line.x1 + 40} ${line.y1}, ${line.x2 - 40} ${line.y2}, ${line.x2} ${line.y2}`}
                            strokeWidth="1.5"
                            className="stroke-gray-500 transition-all duration-500"
                            fill="none"
                        />
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default SchemaDiagram;
