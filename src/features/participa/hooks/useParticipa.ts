import { useState, useEffect } from 'react';
import type { PollQuestion } from '../types';
import { INITIAL_POLL } from '../../../data/seed-data';
import { calculatePollOptionPercentages } from '../../../lib/community-logic';
import { useHaptics } from '../../../hooks/useHaptics';

export function useParticipa() {
  const { triggerHaptic } = useHaptics();
  const [poll, setPoll] = useState<PollQuestion>(() => {
    try {
      const saved = localStorage.getItem('sobradinho_poll_v2');
      return saved ? JSON.parse(saved) : INITIAL_POLL;
    } catch {
      return INITIAL_POLL;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sobradinho_poll_v2', JSON.stringify(poll));
    } catch {}
  }, [poll]);

  const percentages = calculatePollOptionPercentages(poll);

  const handleVote = (optionId: string) => {
    if (poll.userVotedOptionId === optionId) return;
    triggerHaptic('success');

    setPoll((prev) => {
      const updated = prev.options.map((opt) => {
        if (opt.id === optionId) {
          return { ...opt, votes: opt.votes + 1 };
        }
        if (opt.id === prev.userVotedOptionId) {
          return { ...opt, votes: Math.max(0, opt.votes - 1) };
        }
        return opt;
      });

      return {
        ...prev,
        options: updated,
        totalVotes: updated.reduce((acc, c) => acc + c.votes, 0),
        userVotedOptionId: optionId,
      };
    });
  };

  return {
    poll,
    percentages,
    handleVote,
  };
}
