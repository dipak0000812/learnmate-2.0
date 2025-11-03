// Add this button to test error boundary
<Button 
  onClick={() => {
    throw new Error('Test error boundary!');
  }}
  variant="danger"
>
  Test Error Boundary
</Button>