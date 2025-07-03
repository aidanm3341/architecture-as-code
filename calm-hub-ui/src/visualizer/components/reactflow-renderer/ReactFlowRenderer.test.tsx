import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReactFlowRenderer } from './ReactFlowRenderer.js';
import { ReactFlowNode, ReactFlowEdge } from '../../contracts/contracts.js';

// Mock ReactFlow
vi.mock('reactflow', () => ({
    ReactFlow: ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="react-flow">
            {children}
        </div>
    ),
    Controls: () => <div data-testid="react-flow-controls" />,
    Background: () => <div data-testid="react-flow-background" />,
    MiniMap: () => <div data-testid="react-flow-minimap" />,
    BackgroundVariant: {
        Dots: 'dots',
    },
    ConnectionMode: {
        Loose: 'loose',
    },
    SelectionMode: {
        Partial: 'partial',
    },
    MarkerType: {
        ArrowClosed: 'arrowclosed',
    },
    ConnectionLineType: {
        Straight: 'straight',
    },
    Position: {
        Top: 'top',
        Right: 'right',
        Bottom: 'bottom',
        Left: 'left',
    },
    Handle: () => <div data-testid="react-flow-handle" />,
    useNodesState: () => [[], vi.fn(), vi.fn()],
    useEdgesState: () => [[], vi.fn(), vi.fn()],
    useReactFlow: () => ({
        getNodes: () => [],
        getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
    }),
    useViewport: () => ({ x: 0, y: 0, zoom: 1 }),
    useNodes: () => [],
    getNodesBounds: () => ({ x: 0, y: 0, width: 100, height: 100 }),
}));

// Mock node position service
vi.mock('../../services/node-position-service.js', () => ({
    saveNodePositions: vi.fn(),
    loadStoredNodePositions: vi.fn(() => null),
}));

describe('ReactFlowRenderer', () => {
    const mockNodeClickedCallback = vi.fn();
    const mockEdgeClickedCallback = vi.fn();

    const mockNodes: ReactFlowNode[] = [
        {
            data: {
                id: 'node-1',
                name: 'Test Node',
                description: 'Test description',
                type: 'service',
                reactFlowProps: {
                    labelWithDescription: 'Test Node\n[service]\n\nTest description',
                    labelWithoutDescription: 'Test Node\n[service]',
                },
            },
            position: { x: 100, y: 100 },
        },
    ];

    const mockEdges: ReactFlowEdge[] = [
        {
            data: {
                id: 'edge-1',
                label: 'Test Edge',
                source: 'node-1',
                target: 'node-2',
            },
        },
    ];

    const defaultProps = {
        isNodeDescActive: true,
        isRelationshipDescActive: true,
        nodes: mockNodes,
        edges: mockEdges,
        nodeClickedCallback: mockNodeClickedCallback,
        edgeClickedCallback: mockEdgeClickedCallback,
        calmKey: 'test-key',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders ReactFlow component', () => {
        render(<ReactFlowRenderer {...defaultProps} />);
        
        expect(screen.getByTestId('react-flow')).toBeInTheDocument();
        expect(screen.getByTestId('react-flow-controls')).toBeInTheDocument();
        expect(screen.getByTestId('react-flow-background')).toBeInTheDocument();
        expect(screen.getByTestId('react-flow-minimap')).toBeInTheDocument();
    });

    it('renders with empty nodes and edges', () => {
        render(<ReactFlowRenderer {...defaultProps} nodes={[]} edges={[]} />);
        
        expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    });

    it('applies correct wrapper styling', () => {
        render(<ReactFlowRenderer {...defaultProps} />);
        
        const wrapper = screen.getByTestId('react-flow').parentElement;
        expect(wrapper).toHaveClass('reactflow-wrapper');
        expect(wrapper).toHaveStyle({
            height: '100vh',
            width: '100%',
        });
    });
});