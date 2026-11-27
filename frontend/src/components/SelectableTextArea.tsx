import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  onWordSelect: (word: string) => void;
  onTextChange?: (text: string) => void;
  className?: string;
  fontSize?: string;
}

interface WordRange {
  word: string;
  start: number;
  end: number;
}

interface Segment {
  value: string;
  start: number;
  end: number;
  isWord: boolean;
}

const WORD_REGEX = /[\p{L}\p{N}_]+(?:['’\-][\p{L}\p{N}_]+)*/gu;

function tokenize(text: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  WORD_REGEX.lastIndex = 0;

  while ((match = WORD_REGEX.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    if (start > lastIndex) {
      segments.push({
        value: text.slice(lastIndex, start),
        start: lastIndex,
        end: start,
        isWord: false,
      });
    }

    segments.push({
      value: match[0],
      start,
      end,
      isWord: true,
    });

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    segments.push({
      value: text.slice(lastIndex),
      start: lastIndex,
      end: text.length,
      isWord: false,
    });
  }

  return segments;
}

function findWordRange(
  text: string,
  selectionStart: number,
  selectionEnd: number
): WordRange | null {
  WORD_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;

  while ((match = WORD_REGEX.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    const intersects =
      selectionStart === selectionEnd
        ? selectionStart >= start && selectionStart < end
        : selectionStart < end && selectionEnd > start;

    if (intersects) {
      return {
        word: match[0],
        start,
        end,
      };
    }
  }

  return null;
}

const sharedStyles = {
  width: "100%",
  height: "8em",
  minHeight: "6em",
  boxSizing: "border-box" as const,
  padding: "0.75em",
  border: "1px solid rgba(127, 127, 127, 0.35)",
  borderRadius: "0.5em",
  background: "transparent",
  color: "inherit",
  font: "inherit",
  lineHeight: 1.5,
  whiteSpace: "pre-wrap" as const,
  wordBreak: "normal" as const,
  overflowWrap: "normal" as const,
  overflow: "auto",
};

export default function SelectableTextArea({
  text,
  onWordSelect,
  onTextChange,
  fontSize = "1em",
  className,
}: Props) {
  const [value, setValue] = useState(text);
  const [selectedWord, setSelectedWord] = useState<WordRange | null>(null);
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize external text changes.
  useEffect(() => {
    setValue(text);
    setSelectedWord(null);
    setHoveredWord(null);
  }, [text]);

  // Close selection mode when clicking outside the component.
  useEffect(() => {
    if (!selectedWord) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedWord(null);
        setHoveredWord(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [selectedWord]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;

    setValue(newValue);
    onTextChange?.(newValue);
  };

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLTextAreaElement>
  ) => {
    const textarea = event.currentTarget;

    const range = findWordRange(
      value,
      textarea.selectionStart,
      textarea.selectionEnd
    );

    if (!range) return;

    event.preventDefault();

    setSelectedWord(range);
    setHoveredWord(null);

    onWordSelect(range.word);
  };

  const handleWordClick = (segment: Segment) => {
    setSelectedWord({
      word: segment.value,
      start: segment.start,
      end: segment.end,
    });

    setHoveredWord(null);

    onWordSelect(segment.value);
  };

  const handleSelectionAreaClick = () => {
    setSelectedWord(null);
    setHoveredWord(null);

    // Restore textarea focus when clicking non-word space.
    requestAnimationFrame(() => {
      textareaRef.current?.focus();

      if (selectedWord) {
        textareaRef.current?.setSelectionRange(
          selectedWord.start,
          selectedWord.start
        );
      }
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setSelectedWord(null);
      setHoveredWord(null);
    }
  };

  const segments = tokenize(value);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {!selectedWord ? (
        // STATE 1: Normal editable textarea
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onDoubleClick={handleDoubleClick}
          wrap="soft"
          className={className}
          spellCheck={false}
          style={{
            ...sharedStyles,
            resize: "vertical",
            display: "block",
            outline: "none",
            fontSize: fontSize,
          }}
        />
      ) : (
        // STATE 2: Word selection mode
        <div
          role="textbox"
          aria-readonly="true"
          aria-multiline="true"
          tabIndex={0}
          onClick={handleSelectionAreaClick}
          onKeyDown={handleKeyDown}
          className={className}
          style={{
            ...sharedStyles,
            resize: "vertical",
            userSelect: "none",
            cursor: "text",
            outline: "none",
            fontSize: fontSize,
          }}
        >
          {segments.map((segment) => {
            if (!segment.isWord) {
              return (
                <span key={segment.start}>
                  {segment.value}
                </span>
              );
            }

            const isSelected =
              selectedWord.start === segment.start;

            const isHovered =
              hoveredWord === segment.start;

            return (
              <span
                key={segment.start}
                onClick={(event) => {
                  event.stopPropagation();
                  handleWordClick(segment);
                }}
                onMouseEnter={() => {
                  setHoveredWord(segment.start);
                }}
                onMouseLeave={() => {
                  setHoveredWord(null);
                }}
                style={{
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  borderRadius: "5px",
                  paddingInline: "0",
                  backgroundColor: isSelected
                    ? "#5B4BFF"
                    : isHovered
                    ? "rgba(91, 75, 255, 0.28)"
                    : "transparent",
                  color: isSelected ? "#FFFFFF" : "inherit",
                  transition: "background-color 120ms ease",
                }}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  setSelectedWord(null);
                  setHoveredWord(null);

                  requestAnimationFrame(() => {
                    textareaRef.current?.focus();
                  });
                }}
              >
                {segment.value}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}