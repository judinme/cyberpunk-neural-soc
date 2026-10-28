import React from 'react';
import CitadelCanvas from '../CitadelCanvas';
import ReactorCore from '../ReactorCore';
import ThreatRadar from '../ThreatRadar';
import InferenceCrown from '../InferenceCrown';
import ProcessMatrix from '../ProcessMatrix';

export default function CyberpunkSOC({
  theme,
  telemetry,
  isDefcon,
  isSurging,
  onTriggerSurge,
  activeTexture,
  onSelectTexture,
  customTextureUrl,
  onUploadCustomTexture,
  explodedView,
  onToggleExplodedView,
  onToggleDefcon,
  activeNode,
  onSelectNode,
  onSendCommand
}) {
  return (
    <div className="grid grid-cols-12 gap-3 w-full">
      {/* LEFT COLUMN: MODULE 1 (REACTOR & HEATMAP) + MODULE 2 (THREAT RADAR) */}
      <section className="col-span-12 lg:col-span-3 flex flex-col gap-3">
        <ReactorCore
          theme={theme}
          telemetry={telemetry}
          isDefcon={isDefcon}
        />
        <ThreatRadar
          theme={theme}
          telemetry={telemetry}
          isDefcon={isDefcon}
          onToggleDefcon={onToggleDefcon}
          activeNode={activeNode}
          onSelectNode={onSelectNode}
        />
      </section>

      {/* CENTER COLUMN: 3D CITADEL MONOLITH VIEWPORT & 90° NEURAL BUS */}
      <section className="col-span-12 lg:col-span-6 flex flex-col gap-3 h-[520px] lg:h-auto min-h-[500px]">
        <div
          className="flex-1 rounded-xl backdrop-blur-md border relative overflow-hidden flex flex-col shadow-2xl"
          style={{
            backgroundColor: 'rgba(3, 7, 18, 0.75)',
            borderColor: isDefcon ? '#ef4444' : theme.cardBorder,
            boxShadow: isDefcon ? '0 0 35px rgba(239,68,68,0.3)' : `0 0 25px ${theme.glow}`,
          }}
        >
          <CitadelCanvas
            theme={theme}
            telemetry={telemetry}
            isDefcon={isDefcon}
            isSurging={isSurging}
            onTriggerSurge={onTriggerSurge}
            activeTexture={activeTexture}
            onSelectTexture={onSelectTexture}
            customTextureUrl={customTextureUrl}
            onUploadCustomTexture={onUploadCustomTexture}
            explodedView={explodedView}
            onToggleExplodedView={onToggleExplodedView}
          />
        </div>
      </section>

      {/* RIGHT COLUMN: MODULE 3 (INFERENCE CROWN) + MODULE 4 (PROCESS MATRIX) */}
      <section className="col-span-12 lg:col-span-3 flex flex-col gap-3">
        <InferenceCrown
          theme={theme}
          telemetry={telemetry}
          isDefcon={isDefcon}
          onTriggerSurge={onTriggerSurge}
        />
        <ProcessMatrix
          theme={theme}
          isDefcon={isDefcon}
          onSendCommand={onSendCommand}
        />
      </section>
    </div>
  );
}
